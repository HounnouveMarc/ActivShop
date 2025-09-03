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

class SimpleOrderService {
  // Identifiants fixes du fournisseur
  private readonly WHATSAPP_NUMBER = '22948740015'; // Numéro WhatsApp du fournisseur
  private readonly FACEBOOK_PAGE = 'https://www.facebook.com/share/v/1GZFPuWTcd/'; // Page Facebook du fournisseur
  private readonly INSTAGRAM_USERNAME = 'https://www.instagram.com/activshop_bj'; // Instagram du fournisseur

  /**
   * Sauvegarde une commande localement (localStorage)
   */
  async saveOrder(orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: this.generateOrderId(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Sauvegarder dans localStorage
      const existingOrders = this.getLocalOrders();
      existingOrders.push(order);
      localStorage.setItem('activshop_orders', JSON.stringify(existingOrders));

      return order;
    } catch (error) {
      console.error('Erreur SimpleOrderService.saveOrder:', error);
      throw new Error('Impossible de sauvegarder la commande');
    }
  }

  /**
   * Envoie une commande via WhatsApp
   */
  async sendWhatsAppOrder(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(order);
      // Utiliser TOUJOURS le numéro du fournisseur, pas celui du client
      const phoneNumber = this.WHATSAPP_NUMBER.replace(/\D/g, '');
      
      // URL WhatsApp avec le message formaté
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      
      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Erreur SimpleOrderService.sendWhatsAppOrder:', error);
      return false;
    }
  }

  /**
   * Envoie une commande via Facebook
   */
  async sendFacebookOrder(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(order);
      
      // Redirection vers la page Facebook du fournisseur
      const facebookUrl = this.FACEBOOK_PAGE;
      window.open(facebookUrl, '_blank');
      
      // Afficher le message dans une alerte pour copier
      setTimeout(() => {
        alert(`Message à copier et envoyer sur Facebook :\n\n${message}`);
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Erreur SimpleOrderService.sendFacebookOrder:', error);
      return false;
    }
  }

  /**
   * Envoie une commande via Instagram
   */
  async sendInstagramOrder(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(order);
      
      // Redirection vers Instagram du fournisseur
      const instagramUrl = this.INSTAGRAM_USERNAME;
      window.open(instagramUrl, '_blank');
      
      // Afficher le message dans une alerte pour copier
      setTimeout(() => {
        alert(`Message à copier et envoyer sur Instagram :\n\n${message}`);
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Erreur SimpleOrderService.sendInstagramOrder:', error);
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
      console.error('Erreur SimpleOrderService.sendOrderToPlatform:', error);
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
   * Récupère toutes les commandes depuis localStorage
   */
  getLocalOrders(): Order[] {
    try {
      const orders = localStorage.getItem('activshop_orders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Erreur SimpleOrderService.getLocalOrders:', error);
      return [];
    }
  }

  /**
   * Met à jour le statut d'une commande
   */
  updateOrderStatus(orderId: string, status: Order['status']): boolean {
    try {
      const orders = this.getLocalOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('activshop_orders', JSON.stringify(orders));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur SimpleOrderService.updateOrderStatus:', error);
      return false;
    }
  }

  /**
   * Exporte les commandes en CSV
   */
  exportOrdersToCSV(): string {
    const orders = this.getLocalOrders();
    
    if (orders.length === 0) {
      return '';
    }

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
      'Statut'
    ];

    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id,
        order.timestamp,
        order.clientInfo.nom,
        order.clientInfo.telephone,
        order.clientInfo.email,
        order.clientInfo.adresse,
        order.clientInfo.ville,
        order.contactMethod,
        order.platformInfo[order.contactMethod as keyof PlatformInfo] || '',
        order.items.map(item => `${item.productName} x${item.quantity}`).join('; '),
        order.totalAmount,
        order.status
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Télécharge les commandes en CSV
   */
  downloadOrdersCSV(): void {
    const csvContent = this.exportOrdersToCSV();
    
    if (!csvContent) {
      alert('Aucune commande à exporter');
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `commandes_activshop_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const simpleOrderService = new SimpleOrderService();
