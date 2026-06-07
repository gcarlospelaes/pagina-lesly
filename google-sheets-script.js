/**
 * ═══════════════════════════════════════
 * GOOGLE APPS SCRIPT — Oro Punto
 * ═══════════════════════════════════════
 *
 * INSTRUCCIONES PARA CONECTAR EL FORMULARIO A GOOGLE SHEETS:
 *
 * 1. Abre Google Sheets → crea una hoja nueva llamada "Contactos"
 * 2. En la primera fila escribe los encabezados:
 *    A1: Fecha  |  B1: Teléfono  |  C1: Correo  |  D1: Asunto
 *
 * 3. Ve a Extensiones → Apps Script
 * 4. Borra el contenido del editor y pega TODO este código
 * 5. Guarda el proyecto (Ctrl+S) con cualquier nombre
 *
 * 6. Haz clic en "Implementar" → "Nueva implementación"
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier persona
 * 7. Haz clic en "Implementar" y autoriza los permisos
 * 8. Copia la URL que aparece
 *
 * 9. Abre main.js y reemplaza:
 *    const SHEET_URL = 'TU_GOOGLE_APPS_SCRIPT_URL_AQUI';
 *    por:
 *    const SHEET_URL = 'https://script.google.com/macros/s/XXXXXXX/exec';
 *
 * ¡Listo! Cada vez que alguien envíe el formulario,
 * los datos se guardarán automáticamente en tu Google Sheet.
 * ═══════════════════════════════════════
 */

const SHEET_NAME = 'Contactos';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', message: 'Hoja no encontrada' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const params = e.parameter;

    const fecha   = params.fecha   || new Date().toLocaleString('es-GT');
    const telefono = params.telefono || '';
    const correo   = params.correo   || '';
    const asunto   = params.asunto   || '';

    // Agregar fila al sheet
    sheet.appendRow([fecha, telefono, correo, asunto]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función de prueba (opcional) — ejecuta desde el editor para verificar
function testManual() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);

  sheet.appendRow([
    new Date().toLocaleString('es-GT'),
    '+502 1234-5678',
    'prueba@ejemplo.com',
    'Tengo varias piezas de oro para vender'
  ]);

  Logger.log('Fila de prueba insertada correctamente.');
}
