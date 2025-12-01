#!/bin/bash

# Configuración
DOMAIN="fjgaparicio.es"
WWW_DOMAIN="www.fjgaparicio.es"
EXPECTED_TEXT="Profesional Web" # Texto esperado en el título o body (ajustar según contenido real)

echo "🔍 Iniciando verificación de despliegue para $DOMAIN..."

# Función para verificar código de estado HTTP
check_status() {
    url=$1
    expected_code=$2
    echo -n "   Checking $url... "
    code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [ "$code" -eq "$expected_code" ]; then
        echo "✅ OK ($code)"
        return 0
    else
        echo "❌ FALLO (Esperado: $expected_code, Recibido: $code)"
        return 1
    fi
}

# Función para verificar redirección HTTPS
check_https_redirect() {
    url=$1
    echo -n "   Checking HTTP -> HTTPS redirect for $url... "
    target=$(curl -s -I "$url" | grep -i "location:" | awk '{print $2}' | tr -d '\r')
    
    if [[ "$target" == https* ]]; then
        echo "✅ OK (Redirects to HTTPS)"
        return 0
    else
        echo "❌ FALLO (No redirige a HTTPS: $target)"
        return 1
    fi
}

# 1. Verificar accesibilidad básica (HTTPS)
echo "1️⃣  Verificando accesibilidad HTTPS..."
check_status "https://$DOMAIN" 200 || exit 1
check_status "https://$WWW_DOMAIN" 200 || exit 1 # O 301/308 si redirige a root, Vercel suele redirigir www a non-www o viceversa

# 2. Verificar redirección HTTP -> HTTPS
echo "2️⃣  Verificando forzado de SSL..."
check_https_redirect "http://$DOMAIN"
check_https_redirect "http://$WWW_DOMAIN"

# 3. Verificar contenido
echo "3️⃣  Verificando contenido de la página..."
content=$(curl -s "https://$DOMAIN")
if echo "$content" | grep -q "$EXPECTED_TEXT"; then
    echo "✅ Contenido verificado: Se encontró '$EXPECTED_TEXT'"
else
    echo "⚠️  ADVERTENCIA: No se encontró el texto '$EXPECTED_TEXT'. Verifica manualmente."
fi

# 4. Verificar certificado SSL (básico)
echo "4️⃣  Verificando certificado SSL..."
expiration_date=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d= -f2)
if [ -n "$expiration_date" ]; then
    echo "✅ Certificado SSL válido. Expira: $expiration_date"
else
    echo "❌ No se pudo obtener información del certificado SSL."
fi

echo "---------------------------------------------------"
echo "🚀 Verificación completada."
