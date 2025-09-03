// Google Apps Script pour gérer les commandes ActivShop Bénin
// À déployer comme web app : https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // ID de votre Google Sheet
const SHEET_NAME = 'Commandes'; // Nom de l'onglet

/**
 * Point d'entrée principal pour les requêtes HTTP
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'addOrder':
        return handleAddOrder(data.data);
      case 'updateOrderStatus':
        return handleUpdateOrderStatus(data.orderId, data.status);
      default:
        return createResponse(400, { error: 'Action non reconnue' });
    }
  } catch (error) {
    console.error('Erreur doPost:', error);
    return createResponse(500, { error: 'Erreur serveur' });
  }
}

/**
 * Point d'entrée pour les requêtes GET
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch (action) {
      case 'getOrders':
        return handleGetOrders();
      default:
        return createResponse(400, { error: 'Action non reconnue' });
    }
  } catch (error) {
    console.error('Erreur doGet:', error);
    return createResponse(500, { error: 'Erreur serveur' });
  }
}

/**
 * Gère l'ajout d'une nouvelle commande
 */
function handleAddOrder(orderData) {
  try {
    const sheet = getSheet();
    const timestamp = new Date().toISOString();
    
    // Préparer les données pour la ligne
    const rowData = [
      orderData.orderId,
      timestamp,
      orderData.clientName,
      orderData.clientPhone,
      orderData.clientEmail,
      orderData.clientAddress,
      orderData.clientCity,
      orderData.contactMethod,
      orderData.platformContact,
      orderData.items,
      orderData.totalAmount,
      orderData.status,
      orderData.message
    ];
    
    // Ajouter la ligne
    sheet.appendRow(rowData);
    
    // Envoyer une notification par email (optionnel)
    sendOrderNotification(orderData);
    
    return createResponse(200, { 
      success: true, 
      orderId: orderData.orderId,
      message: 'Commande enregistrée avec succès'
    });
  } catch (error) {
    console.error('Erreur handleAddOrder:', error);
    return createResponse(500, { error: 'Erreur lors de l\'enregistrement' });
  }
}

/**
 * Gère la récupération des commandes
 */
function handleGetOrders() {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Ignorer l'en-tête
    const orders = data.slice(1).map(row => ({
      orderId: row[0],
      timestamp: row[1],
      clientName: row[2],
      clientPhone: row[3],
      clientEmail: row[4],
      clientAddress: row[5],
      clientCity: row[6],
      contactMethod: row[7],
      platformContact: row[8],
      items: row[9],
      totalAmount: row[10],
      status: row[11],
      message: row[12]
    }));
    
    return createResponse(200, { orders });
  } catch (error) {
    console.error('Erreur handleGetOrders:', error);
    return createResponse(500, { error: 'Erreur lors de la récupération' });
  }
}

/**
 * Gère la mise à jour du statut d'une commande
 */
function handleUpdateOrderStatus(orderId, newStatus) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Trouver la ligne avec l'orderId
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === orderId) {
        rowIndex = i + 1; // +1 car les indices de Google Sheets commencent à 1
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createResponse(404, { error: 'Commande non trouvée' });
    }
    
    // Mettre à jour le statut (colonne 12, index 11)
    sheet.getRange(rowIndex, 12).setValue(newStatus);
    
    return createResponse(200, { 
      success: true, 
      message: 'Statut mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur handleUpdateOrderStatus:', error);
    return createResponse(500, { error: 'Erreur lors de la mise à jour' });
  }
}

/**
 * Obtient la feuille de calcul
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Créer la feuille si elle n'existe pas
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    setupSheetHeaders(sheet);
  }
  
  return sheet;
}

/**
 * Configure les en-têtes de la feuille
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'ID Commande',
    'Date/Heure',
    'Nom Client',
    'Téléphone',
    'Email',
    'Adresse',
    'Ville',
    'Méthode Contact',
    'Contact Plateforme',
    'Produits',
    'Montant Total',
    'Statut',
    'Message'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formater les en-têtes
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Ajuster la largeur des colonnes
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Envoie une notification par email (optionnel)
 */
function sendOrderNotification(orderData) {
  try {
    const subject = `Nouvelle commande ${orderData.orderId} - ActivShop Bénin`;
    const body = `
      Nouvelle commande reçue !
      
      ID Commande: ${orderData.orderId}
      Client: ${orderData.clientName}
      Téléphone: ${orderData.clientPhone}
      Email: ${orderData.clientEmail}
      Adresse: ${orderData.clientAddress}, ${orderData.clientCity}
      Méthode de contact: ${orderData.contactMethod}
      Contact plateforme: ${orderData.platformContact}
      
      Produits:
      ${orderData.items}
      
      Montant total: ${orderData.totalAmount} FCFA
      
      Message:
      ${orderData.message}
    `;
    
    // Remplacer par votre email
    const adminEmail = 'votre-email@gmail.com';
    MailApp.sendEmail(adminEmail, subject, body);
  } catch (error) {
    console.error('Erreur envoi notification:', error);
  }
}

/**
 * Crée une réponse HTTP
 */
function createResponse(statusCode, data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setStatusCode(statusCode);
}

/**
 * Fonction de test pour vérifier que le script fonctionne
 */
function testScript() {
  const testOrder = {
    orderId: 'TEST-001',
    clientName: 'Test Client',
    clientPhone: '+229 12345678',
    clientEmail: 'test@example.com',
    clientAddress: 'Test Address',
    clientCity: 'Cotonou',
    contactMethod: 'whatsapp',
    platformContact: '+229 12345678',
    items: 'Produit Test x1',
    totalAmount: 10000,
    status: 'pending',
    message: 'Test message'
  };
  
  const result = handleAddOrder(testOrder);
  console.log('Test result:', result);
}
