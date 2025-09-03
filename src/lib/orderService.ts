export interface OrderItem {
  productId: number;
  quantity: number;
  productName: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ClientInfo {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
}

export interface PlatformInfo {
  whatsapp: string;
  facebook: string;
  instagram: string;
}

export interface Order {
  id: string;
  timestamp: string;
  clientInfo: ClientInfo;
  platformInfo: PlatformInfo;
  contactMethod: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  message: string;
}

class OrderService {
  private readonly GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  private readonly WHATSAPP_API_URL = 'https://api.whatsapp.com/send';
  private readonly FACEBOOK_PAGE_ID = 'YOUR_FACEBOOK_PAGE_ID';
  private readonly FACEBOOK_ACCESS_TOKEN = 'YOUR_FACEBOOK_ACCESS_TOKEN';

  /**
   * Sauvegarde une commande dans Google Sheets
   */
  async saveOrder(orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: this.generateOrderId(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Préparer les données pour Google Sheets
      const sheetData = {
        orderId: order.id,
        timestamp: order.timestamp,
        clientName: order.clientInfo.nom,
        clientPhone: order.clientInfo.telephone,
        clientEmail: order.clientInfo.email,
        clientAddress: order.clientInfo.adresse,
        clientCity: order.clientInfo.ville,
        contactMethod: order.contactMethod,
        platformContact: order.platformInfo[order.contactMethod as keyof PlatformInfo] || '',
        items: order.items.map(item => `${item.productName} x${item.quantity}`).join(', '),
        totalAmount: order.totalAmount,
        status: order.status,
        message: order.message
      };

      // Envoyer à Google Sheets
      const response = await fetch(this.GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addOrder',
          data: sheetData
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde dans Google Sheets');
      }

      return order;
    } catch (error) {
      console.error('Erreur OrderService.saveOrder:', error);
      throw new Error('Impossible de sauvegarder la commande');
    }
  }

  /**
   * Envoie une commande via WhatsApp Business API
   */
  async sendWhatsAppOrder(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(order);
      const phoneNumber = order.platformInfo.whatsapp.replace(/\D/g, ''); // Garder seulement les chiffres
      
      // URL WhatsApp avec le message formaté
      const whatsappUrl = `${this.WHATSAPP_API_URL}?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      
      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Erreur OrderService.sendWhatsAppOrder:', error);
      return false;
    }
  }

  /**
   * Envoie une commande via Facebook Messenger API
   */
  async sendFacebookOrder(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(order);
      
      // Pour Facebook, on utilise l'API Messenger
      const response = await fetch(`https://graph.facebook.com/v18.0/${this.FACEBOOK_PAGE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: { id: order.platformInfo.facebook },
          message: { text: message },
          access_token: this.FACEBOOK_ACCESS_TOKEN
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API Facebook');
      }

      return true;
    } catch (error) {
      console.error('Erreur OrderService.sendFacebookOrder:', error);
      // Fallback: ouvrir Facebook dans un nouvel onglet
      const facebookUrl = `https://www.facebook.com/messages/t/${order.platformInfo.facebook}`;
      window.open(facebookUrl, '_blank');
      return false;
    }
  }

  /**
   * Envoie une commande via Instagram Direct Message
   */
  async sendInstagramOrder(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(order);
      
      // Instagram n'a pas d'API publique pour les DMs, on redirige vers l'app
      const instagramUrl = `https://www.instagram.com/direct/t/${order.platformInfo.instagram}`;
      window.open(instagramUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Erreur OrderService.sendInstagramOrder:', error);
      return false;
    }
  }

  /**
   * Envoie la commande selon la plateforme choisie
   */
  async sendOrderToPlatform(order: Order): Promise<boolean> {
    try {
      switch (order.contactMethod) {
        case 'whatsapp':
          return await this.sendWhatsAppOrder(order);
        case 'facebook':
          return await this.sendFacebookOrder(order);
        case 'instagram':
          return await this.sendInstagramOrder(order);
        default:
          throw new Error('Plateforme non supportée');
      }
    } catch (error) {
      console.error('Erreur OrderService.sendOrderToPlatform:', error);
      return false;
    }
  }

  /**
   * Formate le message de commande
   */
  private formatOrderMessage(order: Order): string {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 18 ? "Bonjour" : "Bonsoir";
    
    const cartDetails = order.items
      .map(item => `• ${item.productName} x${item.quantity} (${item.totalPrice.toLocaleString()} FCFA)`)
      .join("\n");

    const total = order.totalAmount.toLocaleString() + " FCFA";
    
    const selectedMethod = this.getContactMethodName(order.contactMethod);
    const platformContact = `${selectedMethod}: ${order.platformInfo[order.contactMethod as keyof PlatformInfo]}`;
    
    const clientDetails = `👤 **Informations client :**\nNom: ${order.clientInfo.nom}\nTéléphone: ${order.clientInfo.telephone}\nEmail: ${order.clientInfo.email}\nAdresse: ${order.clientInfo.adresse}, ${order.clientInfo.ville}\n\n📱 **Contact ${selectedMethod} :**\n${platformContact}`;

    return `${greeting} ! 👋\n\nJe souhaite commander les produits suivants :\n\n${cartDetails}\n\n💰 **Prix total : ${total}**\n\n${clientDetails}\n\n🚚 Merci de me confirmer la disponibilité et les modalités de livraison et paiement.\n\n💪 ActivShop Bénin !`;
  }

  /**
   * Génère un ID unique pour la commande
   */
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CMD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Obtient le nom de la méthode de contact
   */
  private getContactMethodName(method: string): string {
    const names = {
      whatsapp: 'WhatsApp',
      facebook: 'Facebook',
      instagram: 'Instagram'
    };
    return names[method as keyof typeof names] || method;
  }

  /**
   * Récupère toutes les commandes depuis Google Sheets
   */
  async getOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${this.GOOGLE_SHEETS_URL}?action=getOrders`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error('Erreur OrderService.getOrders:', error);
      return [];
    }
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const response = await fetch(this.GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateOrderStatus',
          orderId,
          status
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur OrderService.updateOrderStatus:', error);
      return false;
    }
  }
}

export const orderService = new OrderService();
