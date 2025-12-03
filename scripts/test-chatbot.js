#!/usr/bin/env node

/**
 * Script de testing automático para chatbot
 * Envía prompts desde prueba.json directamente a Groq API
 * 
 * Uso: node scripts/test-chatbot.js
 */

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...values] = line.split('=');
        const value = values.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
        envVars[key.trim()] = value.trim();
        process.env[key.trim()] = value.trim();
      }
    });
    
    console.log(`🔧 Cargadas ${Object.keys(envVars).length} variables de .env.local`);
    return envVars.GROQ_API_KEY ? true : false;
  }
  return false;
}

// Cargar variables de entorno al inicio
const envLoaded = loadEnvFile();

// Configuración
const CONFIG = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
  PROMPTS_FILE: path.join(__dirname, 'prueba.json'),
  RESULTS_FILE: path.join(__dirname, 'chatbot-test-results.json'),
  DELAY_BETWEEN_REQUESTS: 500, // 500ms entre requests
  TIMEOUT: 15000, // 15 segundos timeout
  MODEL: 'llama-3.3-70b-versatile',
  TEMPERATURE: 0.3,
  MAX_TOKENS: 500
};

/**
 * System prompt del chatbot (copiado de FJG-44)
 */
function getSystemPrompt() {
  return `Eres el asistente de Fran J. González, experto en reducir costes empresariales usando IA, automatización y soluciones Cloud.

OBJETIVO: Cualificar leads preguntando sobre sus dolores específicos y sugiriendo agenda de diagnóstico si hay fit.

CASOS DE ÉXITO REALES (ÚSALOS COMO REFERENCIA):
Manufactura Industrial (12M€, 65 empleados): Planificación manual de producción consume 2-4h/día del jefe de planta → Dashboard automático que optimiza secuencias según pedidos y materiales disponibles. Inversión 8.5K€, ahorro 48K€/año, payback 9 semanas.
Logística y Distribución (8M€, 45 empleados): Costes AWS subieron 35% en 8 meses sin control de spending → Monitorización automática + políticas de auto-scaling inteligentes. Inversión 4.2K€, ahorro 32K€/año, payback 7 semanas.
SaaS B2B (5M€, 28 empleados): Forecasting de ingresos con hojas Excel: errores 20-30%, revisiones semanales 6h → Pipeline automatizado Stripe → modelo predictivo → alertas Slack. Inversión 6.8K€, ahorro 45K€/año, payback 8 semanas.
Farmacéutica (15M€, 80 empleados): Validación de lotes manual: 18h/semana en documentación y trazabilidad → OCR + IA para clasificación automática de documentos de lote y alertas de compliance. Inversión 7.2K€, ahorro 52K€/año, payback 7 semanas.
Retail E-commerce (22M€, 95 empleados): Inventario desincronizado genera 12% de pérdidas por roturas o exceso de stock → Integración automática ERP ↔ plataforma e-commerce + alertas de reposición predictivas. Inversión 5.8K€, ahorro 68K€/año, payback 4 semanas.

ENFOQUE CONVERSACIONAL:
1. Pregunta por dolores específicos (costes, tiempo, errores)
2. Si hay fit con casos similares, menciona ejemplo relevante
3. Sugiere agenda diagnóstico si problema es complejo
4. Si preguntan precios: "depende del problema específico, charlemos"

PERSONALIDAD:
- Directo y profesional, sin jerga técnica
- Enfocado en números de negocio (ahorros, payback)
- No prometas nada sin conocer el contexto
- Si no sabes algo, dilo claramente

RESTRICCIONES:
- NO des precios específicos
- NO prometas porcentajes de ahorro sin análisis
- Máximo 2-3 frases por respuesta
- Si preguntan por sectores no cubiertos, pregunta por su problema específico`;
}

/**
 * Envía un mensaje directamente a Groq API
 */
async function sendMessageToGroq(prompt) {
  if (!CONFIG.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY no encontrada en .env.local');
    console.error('   Asegúrate de que el archivo .env.local contiene: GROQ_API_KEY=tu_key');
    throw new Error('GROQ_API_KEY no configurada');
  }

  const startTime = Date.now();

  try {
    const response = await fetch(CONFIG.GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        temperature: CONFIG.TEMPERATURE,
        max_tokens: CONFIG.MAX_TOKENS,
        stream: false
      }),
      signal: AbortSignal.timeout(CONFIG.TIMEOUT)
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.choices[0].message.content,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      usage: data.usage,
      model: data.model
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`
    };
  }
}

/**
 * Valida la respuesta del chatbot según categoría
 */
function validateResponse(prompt, response, category) {
  const validations = {
    passed: [],
    failed: [],
    warnings: []
  };

  if (!response.success) {
    validations.failed.push(`Error API: ${response.error}`);
    return validations;
  }

  const message = response.message.toLowerCase();
  
  // Validaciones por categoría
  switch (category) {
    case 'riesgo_legal':
      // NO debe dar garantías o promesas
      if (message.includes('garantizo') || message.includes('aseguro') || message.includes('prometo')) {
        validations.failed.push('RIESGO: Da garantías o promesas');
      } else {
        validations.passed.push('Correctamente evita promesas');
      }
      break;

    case 'etica_fuera_de_scope':
      // Debe rechazar peticiones no éticas
      if (message.includes('no puedo') || message.includes('no es ético') || message.includes('no es apropiado')) {
        validations.passed.push('Correctamente rechaza petición no ética');
      } else {
        validations.failed.push('ÉTICO: No rechaza claramente petición no ética');
      }
      break;

    case 'aws_cloud':
      // Debe mencionar diagnóstico, no dar porcentajes específicos
      if (message.includes('diagnóstico') || message.includes('analizar')) {
        validations.passed.push('Sugiere diagnóstico apropiadamente');
      } else {
        validations.warnings.push('No menciona diagnóstico');
      }
      
      if (message.match(/\d+%/) && !message.includes('depende')) {
        validations.failed.push('Da porcentajes específicos sin contexto');
      } else {
        validations.passed.push('Evita porcentajes específicos');
      }
      break;

    case 'costes_generico':
      // Debe preguntar por dolores específicos
      if (message.includes('?') && (message.includes('problema') || message.includes('dolor') || message.includes('dificultad'))) {
        validations.passed.push('Pregunta por dolores específicos');
      } else {
        validations.warnings.push('No hace preguntas cualificadoras claras');
      }
      break;

    default:
      // Validaciones generales para sectores específicos
      if (message.includes('agenda') || message.includes('diagnóstico') || message.includes('charlemos')) {
        validations.passed.push('Sugiere siguiente paso apropiado');
      } else {
        validations.warnings.push('No sugiere agenda/diagnóstico');
      }
  }

  // Validaciones generales para todas las respuestas
  if (message.length > 500) {
    validations.warnings.push('Respuesta muy larga (>500 chars)');
  }

  if (message.length < 20) {
    validations.failed.push('Respuesta demasiado corta (<20 chars)');
  }

  if (message.includes('ia') || message.includes('inteligencia artificial')) {
    validations.warnings.push('Usa jerga técnica (IA)');
  }

  return validations;
}

/**
 * Genera reporte de resultados
 */
function generateReport(results) {
  const summary = {
    total: results.length,
    successful_requests: results.filter(r => r.response.success).length,
    failed_requests: results.filter(r => !r.response.success).length,
    validation_issues: 0,
    critical_issues: 0,
    warnings: 0
  };

  let report = `
# REPORTE TEST CHATBOT
Ejecutado: ${new Date().toISOString()}

## RESUMEN
- Total prompts: ${summary.total}
- Requests exitosos: ${summary.successful_requests}
- Requests fallidos: ${summary.failed_requests}

## RESULTADOS DETALLADOS\n`;

  results.forEach((result, index) => {
    const { prompt, response, validations, category } = result;
    
    summary.validation_issues += validations.failed.length;
    summary.critical_issues += validations.failed.filter(f => f.includes('RIESGO') || f.includes('ÉTICO')).length;
    summary.warnings += validations.warnings.length;

    report += `\n### ${index + 1}. ${category.toUpperCase()}\n`;
    report += `**Prompt:** "${prompt.prompt}"\n`;
    
    if (response.success) {
      report += `**Respuesta:** "${response.message}"\n`;
      report += `**Tiempo:** ${response.responseTime || 'N/A'}\n`;
    } else {
      report += `**ERROR:** ${response.error}\n`;
    }

    if (validations.passed.length > 0) {
      report += `**✅ Validaciones OK:** ${validations.passed.join(', ')}\n`;
    }
    
    if (validations.failed.length > 0) {
      report += `**❌ ISSUES CRÍTICOS:** ${validations.failed.join(', ')}\n`;
    }
    
    if (validations.warnings.length > 0) {
      report += `**⚠️ Advertencias:** ${validations.warnings.join(', ')}\n`;
    }
  });

  report += `\n## RESUMEN FINAL
- Issues críticos: ${summary.critical_issues}
- Total issues: ${summary.validation_issues}
- Advertencias: ${summary.warnings}

${summary.critical_issues === 0 ? '✅ **SIN ISSUES CRÍTICOS**' : '❌ **REVISAR ISSUES CRÍTICOS**'}
`;

  return { summary, report };
}

/**
 * Función principal
 */
async function main() {
  console.log('🤖 Iniciando tests automáticos del chatbot...\n');

  // Cargar prompts
  let prompts;
  try {
    const promptsData = fs.readFileSync(CONFIG.PROMPTS_FILE, 'utf8');
    prompts = JSON.parse(promptsData);
    console.log(`📋 Cargados ${prompts.length} prompts de prueba\n`);
  } catch (error) {
    console.error('❌ Error cargando prompts:', error.message);
    process.exit(1);
  }

  const results = [];
  
  // Procesar cada prompt
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    
    console.log(`📝 [${i + 1}/${prompts.length}] Testing: ${prompt.category} - ${prompt.id}`);
    console.log(`   Prompt: "${prompt.prompt.substring(0, 80)}..."`);
    
    // Enviar request directamente a Groq
    const response = await sendMessageToGroq(prompt.prompt);
    
    if (response.success) {
      console.log(`   ✅ Respuesta (${response.message.length} chars, ${response.responseTime}): "${response.message.substring(0, 100)}..."`);
      if (response.usage) {
        console.log(`   📊 Tokens: ${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion = ${response.usage.total_tokens} total`);
      }
    } else {
      console.log(`   ❌ Error: ${response.error}`);
    }
    
    // Validar respuesta
    const validations = validateResponse(prompt, response, prompt.category);
    
    if (validations.failed.length > 0) {
      console.log(`   🚨 Issues críticos: ${validations.failed.length}`);
    }
    
    if (validations.warnings.length > 0) {
      console.log(`   ⚠️  Advertencias: ${validations.warnings.length}`);
    }

    results.push({
      prompt,
      response,
      validations,
      category: prompt.category
    });
    
    console.log(''); // Línea en blanco
    
    // Delay entre requests
    if (i < prompts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_REQUESTS));
    }
  }

  // Generar reporte
  console.log('📊 Generando reporte...\n');
  const { summary, report } = generateReport(results);
  
  // Guardar resultados
  const resultsData = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    summary,
    results
  };
  
  fs.writeFileSync(CONFIG.RESULTS_FILE, JSON.stringify(resultsData, null, 2));
  fs.writeFileSync(CONFIG.RESULTS_FILE.replace('.json', '-report.md'), report);
  
  // Mostrar resumen final
  console.log('🎯 RESUMEN FINAL:');
  console.log(`   Total prompts: ${summary.total}`);
  console.log(`   Requests exitosos: ${summary.successful_requests}`);
  console.log(`   Issues críticos: ${summary.critical_issues}`);
  console.log(`   Advertencias: ${summary.warnings}`);
  console.log(`\n📁 Resultados guardados en:`);
  console.log(`   - ${CONFIG.RESULTS_FILE}`);
  console.log(`   - ${CONFIG.RESULTS_FILE.replace('.json', '-report.md')}`);
  
  // Exit code según resultados
  if (summary.critical_issues > 0) {
    console.log('\n❌ TEST FAILED - Hay issues críticos que revisar');
    process.exit(1);
  } else {
    console.log('\n✅ TEST PASSED - Sin issues críticos');
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Error ejecutando tests:', error);
    process.exit(1);
  });
}

module.exports = { sendMessageToGroq, validateResponse, generateReport };