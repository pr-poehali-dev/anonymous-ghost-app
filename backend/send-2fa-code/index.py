"""
Отправка 6-значного кода 2FA на email пользователя.
Генерирует код, сохраняет хэш в памяти (TTL 5 мин) и отправляет письмо через SMTP.
"""
import os
import json
import random
import string
import smtplib
import hashlib
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Хранилище кодов в памяти: {email_hash: {code_hash, expires_at}}
_CODES: dict = {}


def _generate_code() -> str:
    return ''.join(random.choices(string.digits, k=6))


def _hash(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _send_email(to_email: str, code: str) -> None:
    host = os.environ['SMTP_HOST']
    port = int(os.environ['SMTP_PORT'])
    user = os.environ['SMTP_USER']
    password = os.environ['SMTP_PASSWORD']

    msg = MIMEMultipart('alternative')
    msg['Subject'] = '👻 Анонимный призрак — код подтверждения'
    msg['From'] = f'Анонимный призрак <{user}>'
    msg['To'] = to_email

    html = f"""
    <div style="background:#0a0a0a;padding:40px;font-family:monospace;max-width:480px;margin:0 auto;border:1px solid rgba(0,255,245,0.15);border-radius:12px;">
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:48px;">👻</span>
        <h1 style="color:#00fff5;font-size:20px;margin:12px 0 4px;letter-spacing:2px;">АНОНИМНЫЙ ПРИЗРАК</h1>
        <p style="color:#555;font-size:12px;margin:0;">Двухфакторная аутентификация</p>
      </div>
      <div style="background:#111;border:1px solid rgba(0,255,245,0.2);border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="color:#888;font-size:13px;margin:0 0 12px;">Ваш код подтверждения:</p>
        <div style="letter-spacing:12px;font-size:40px;font-weight:bold;color:#00fff5;text-shadow:0 0 20px rgba(0,255,245,0.5);">
          {code}
        </div>
        <p style="color:#555;font-size:11px;margin:16px 0 0;">Действителен 5 минут</p>
      </div>
      <p style="color:#444;font-size:11px;text-align:center;margin:0;">
        Если вы не запрашивали этот код — проигнорируйте письмо.<br>
        Никому не сообщайте код.
      </p>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    if port == 465:
        with smtplib.SMTP_SSL(host, port) as server:
            server.login(user, password)
            server.sendmail(user, to_email, msg.as_string())
    else:
        with smtplib.SMTP(host, port) as server:
            server.ehlo()
            server.starttls()
            server.login(user, password)
            server.sendmail(user, to_email, msg.as_string())


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    # Очистка устаревших кодов
    now = time.time()
    expired = [k for k, v in _CODES.items() if v['expires_at'] < now]
    for k in expired:
        del _CODES[k]

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', 'send')  # 'send' или 'verify'
    email = (body.get('email') or '').strip().lower()

    if not email or '@' not in email:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'success': False, 'error': 'Укажите корректный email'})
        }

    email_hash = _hash(email)

    if action == 'send':
        code = _generate_code()
        _CODES[email_hash] = {
            'code_hash': _hash(code),
            'expires_at': now + 300,  # 5 минут
        }
        _send_email(email, code)
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'success': True, 'message': f'Код отправлен на {email}'})
        }

    elif action == 'verify':
        code_input = str(body.get('code', '')).strip()
        record = _CODES.get(email_hash)

        if not record:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Код не найден или истёк. Запросите новый.'})
            }
        if record['expires_at'] < now:
            del _CODES[email_hash]
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Код истёк. Запросите новый.'})
            }
        if _hash(code_input) != record['code_hash']:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Неверный код. Попробуйте ещё раз.'})
            }

        del _CODES[email_hash]
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'success': True, 'message': 'Код подтверждён'})
        }

    return {
        'statusCode': 400,
        'headers': headers,
        'body': json.dumps({'success': False, 'error': 'Неизвестное действие'})
    }
