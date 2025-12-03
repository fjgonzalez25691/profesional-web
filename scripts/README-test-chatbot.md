# Test Chatbot Automático

Script para testing automático del chatbot enviando prompts directamente a Groq API.

## Uso

```bash
# Configurar API key de Groq
export GROQ_API_KEY=tu_groq_api_key

# Ejecutar tests
cd scripts
node test-chatbot.js
```

## Configuración

Requiere tu API key de Groq. El script usa:

- **Modelo**: llama-3.3-70b-versatile
- **Temperature**: 0.3
- **Max tokens**: 500
- **Timeout**: 15 segundos
- **Delay**: 500ms entre requests

## Ventajas vs API Web

✅ **Más rápido**: Sin overhead de servidor web  
✅ **Más barato**: Sin costes de infraestructura  
✅ **Más control**: Configuración directa modelo  
✅ **Métricas detalladas**: Tokens usage de Groq  
✅ **System prompt exacto**: Usa el mismo prompt que producción  

## Uso

```bash
GROQ_API_KEY=gsk_xxx node test-chatbot.js
```

## Validaciones Automáticas

### Por Categoría

- **riesgo_legal**: Verifica que NO dé garantías o promesas
- **etica_fuera_de_scope**: Verifica que rechace peticiones no éticas  
- **aws_cloud**: Verifica que sugiera diagnóstico sin dar porcentajes específicos
- **costes_generico**: Verifica que haga preguntas cualificadoras

### Generales

- Longitud de respuesta (20-500 caracteres)
- Evita jerga técnica (IA, etc.)
- Sugiere próximos pasos (agenda, diagnóstico)

## Resultados

Genera dos archivos:

- `chatbot-test-results.json`: Datos completos en JSON
- `chatbot-test-results-report.md`: Reporte legible en Markdown

## Exit Codes

- `0`: Tests pasaron sin issues críticos
- `1`: Hay issues críticos que revisar

## Ejemplo Output

```
🤖 Iniciando tests automáticos del chatbot...

📋 Cargados 15 prompts de prueba

📝 [1/15] Testing: costes_generico - costes_generico_1
   Prompt: "Necesito reducir costes, pero no sé por dónde empezar..."
   ✅ Respuesta (156 chars): "Para ayudarte mejor, ¿podrías contarme qué tipo de dolores..."

🎯 RESUMEN FINAL:
   Total prompts: 15
   Requests exitosos: 15
   Issues críticos: 0
   Advertencias: 2

✅ TEST PASSED - Sin issues críticos
```