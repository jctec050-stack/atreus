import { useState, useEffect } from 'react'
import { ShoppingBag, X, MessageCircle, MapPin, Truck, ShieldCheck, ArrowRight, Search, Menu, Star, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Mock Data Enriched for E-commerce
const PRODUCTS = [
  {
    id: 1,
    name: 'Lattafa Asad',
    brand: 'Lattafa',
    description: 'Notas especiadas, vainilla y ámbar. Ideal para la noche.',
    price: 250000,
    image: '/imagenes/asad.png',
    badge: 'Top Seller',
    stock: 5,
    category: 'Para Él',
    rating: 4.9,
    reviews: 128
  },
  {
    id: 2,
    name: 'Club de Nuit Intense',
    brand: 'Armaf',
    description: 'Cítrico, ahumado y amaderado. Una bestia en duración.',
    price: 320000,
    image: '/imagenes/Club de Nuit Intense.jpg',
    badge: 'Pocas Unidades',
    stock: 2,
    category: 'Para Él',
    rating: 4.8,
    reviews: 245
  },
  {
    id: 3,
    name: 'Afnan 9pm',
    brand: 'Afnan',
    description: 'Dulce, avainillado y seductor. Perfecto para fiestas.',
    price: 280000,
    image: '/imagenes/Afnan 9pm.webp',
    badge: null,
    stock: 10,
    category: 'Unisex',
    rating: 4.7,
    reviews: 89
  },
  {
    id: 4,
    name: 'Lattafa Yara',
    brand: 'Lattafa',
    description: 'Dulce, cremoso y atalcado. La esencia de la feminidad.',
    price: 230000,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    badge: 'Nuevo',
    stock: 15,
    category: 'Para Ella',
    rating: 4.9,
    reviews: 312
  }
];

const CATEGORIES = ['Todos', 'Para Él', 'Para Ella', 'Unisex', 'Novedades'];

// Reusable animated section component
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [addedItem, setAddedItem] = useState(null); // For Quick Add micro-interaction

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Quick success feedback instead of instantly opening cart
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const FREE_SHIPPING_THRESHOLD = 500000;
  const progressToFreeShipping = Math.min((totalCart / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totalCart;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(price);
  };

  const handleCheckout = () => {
    const phoneNumber = "595999999999"; 
    let message = "Hola *Atreus Perfumes* ✨ Me gustaría confirmar mi compra:\n\n";
    
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})\n`;
    });
    
    message += `\n📦 *Subtotal:* ${formatPrice(totalCart)}\n`;
    if (totalCart >= FREE_SHIPPING_THRESHOLD) {
      message += `🚚 *Envío:* GRATIS\n`;
      message += `💰 *Total a pagar:* ${formatPrice(totalCart)}\n\n`;
    } else {
      message += `🚚 *Envío:* A calcular\n\n`;
    }
    
    message += "¿Cuáles son los métodos de pago disponibles?";
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredProducts = activeCategory === 'Todos' 
    ? PRODUCTS 
    : activeCategory === 'Novedades' 
      ? PRODUCTS.filter(p => p.badge === 'Nuevo')
      : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-atreus-black text-gray-200 selection:bg-atreus-gold selection:text-black font-sans overflow-x-hidden">
      
      {/* Top Announcement Bar */}
      <div className="bg-atreus-gold text-black py-2 px-4 text-center text-[10px] md:text-xs tracking-widest uppercase font-semibold">
        Envío Gratis a todo el país en compras superiores a {formatPrice(FREE_SHIPPING_THRESHOLD)}
      </div>

      {/* Modern E-commerce Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 border-b ${scrolled ? 'bg-atreus-black/90 backdrop-blur-md border-atreus-border py-4 shadow-sm' : 'bg-atreus-black border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4">
            
            <button className="lg:hidden text-white hover:text-atreus-gold transition-colors">
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center flex-1 lg:flex-none cursor-pointer">
              <span className="font-serif text-xl md:text-2xl tracking-[0.15em] text-white leading-none">ATREUS</span>
              <span className="text-[8px] md:text-[9px] tracking-[0.4em] text-atreus-gold uppercase mt-1 leading-none">Parfums</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {['Para Él', 'Para Ella', 'Unisex', 'Marcas'].map((item) => (
                <button key={item} className="text-sm font-medium text-gray-300 hover:text-white hover:text-shadow-glow transition-all">
                  {item}
                </button>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center justify-end gap-5">
              <button className="hidden sm:block text-white hover:text-atreus-gold transition-colors">
                <Search size={22} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-atreus-gold transition-colors flex items-center gap-2 group"
              >
                <div className="relative">
                  <ShoppingBag strokeWidth={1.5} size={24} />
                  {cart.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 bg-atreus-gold text-black text-[10px] font-bold rounded-full h-4.5 w-4.5 min-w-[18px] flex items-center justify-center px-1 border border-atreus-black"
                    >
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </motion.span>
                  )}
                </div>
                <span className="hidden md:block text-xs font-semibold tracking-wider group-hover:text-atreus-gold transition-colors ml-1">
                  {formatPrice(totalCart)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hard-hitting E-commerce Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-atreus-dark border-b border-atreus-border">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-t from-atreus-black via-atreus-black/60 to-transparent z-10"></div>
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054bd?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"></div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(212,175,55,0.15),_transparent_60%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto mb-8"
          >
            <span className="inline-block py-1 px-3 border border-atreus-gold/30 rounded-full text-atreus-gold text-[10px] tracking-[0.2em] font-semibold uppercase mb-6 bg-atreus-gold/5 backdrop-blur-sm">
              Colección Limitada 2026
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 drop-shadow-2xl">
              Domina con Mística<br/>
              <span className="italic text-gray-300 font-light">Árabe</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base tracking-wide leading-relaxed max-w-xl mx-auto">
              Perfumes intensos, magnéticos y de duración extrema. Eleva tu presencia con las fragancias más virales del Medio Oriente.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button 
              onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-atreus-gold text-black hover:bg-atreus-gold-light hover:shadow-btn transition-all duration-300 rounded-sm text-xs font-bold tracking-[0.2em] uppercase"
            >
              Comprar Ahora
              <ArrowRight size={16} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-atreus-card border-b border-atreus-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <Truck size={20} className="text-atreus-gold" />
              <span className="text-xs font-medium text-gray-300">Envíos a todo el país</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 opacity-80 hover:opacity-100 transition-opacity hidden md:flex">
              <ShieldCheck size={20} className="text-atreus-gold" />
              <span className="text-xs font-medium text-gray-300">100% Originales</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <Star size={20} className="text-atreus-gold" fill="currentColor"/>
              <span className="text-xs font-medium text-gray-300">+500 Clientes Felices</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 opacity-80 hover:opacity-100 transition-opacity hidden md:flex">
              <MessageCircle size={20} className="text-atreus-gold" />
              <span className="text-xs font-medium text-gray-300">Asesoría por WhatsApp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Section */}
      <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-8 text-center">Nuestras Fragancias</h2>
          
          {/* Categories / Filters */}
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all border ${
                  activeCategory === cat 
                    ? 'bg-atreus-gold text-black border-atreus-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                    : 'bg-atreus-card text-gray-400 border-atreus-border hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* E-commerce Grid - Modified for "Bento" feel with feature items */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id} 
                className={`group bg-atreus-card border border-atreus-border hover:border-atreus-gold/30 rounded-lg overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col ${index === 0 && activeCategory === 'Todos' ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black p-4 sm:p-0">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.badge && (
                      <span className={`px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-sm ${
                        product.badge === 'Top Seller' ? 'bg-atreus-gold text-black' : 
                        product.badge === 'Nuevo' ? 'bg-white text-black' : 
                        'bg-red-600 text-white'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 opacity-100 sm:opacity-0 sm:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      disabled={addedItem === product.id}
                      className={`w-full py-3 text-xs tracking-wider uppercase font-bold rounded-sm transition-all flex justify-center items-center gap-2 ${
                        addedItem === product.id 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white text-black hover:bg-atreus-gold'
                      }`}
                    >
                      {addedItem === product.id ? (
                        <><Check size={16} strokeWidth={3} /> Agregado</>
                      ) : (
                        'Añadir a la bolsa'
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">{product.brand}</div>
                  <h3 className="font-serif text-lg sm:text-xl text-white mb-2 leading-tight line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2 hidden sm:flex">
                    <Star size={12} className="text-atreus-gold" fill="currentColor" />
                    <span className="text-[10px] text-gray-400">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-sm sm:text-base font-semibold text-white">{formatPrice(product.price)}</span>
                    {product.stock <= 5 && (
                      <span className="text-[10px] text-red-500 font-medium hidden sm:block">Quedan {product.stock}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Footer Minimalista E-commerce */}
      <footer className="border-t border-atreus-border bg-atreus-black pt-16 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20 mb-12">
          <div>
            <div className="flex flex-col mb-6">
              <span className="font-serif text-2xl tracking-[0.1em] text-white">ATREUS</span>
              <span className="text-[9px] tracking-[0.4em] text-atreus-gold uppercase mt-1">Parfums</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Tu destino definitivo para la perfumería árabe auténtica en todo el Paraguay.
            </p>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-4">Políticas</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-atreus-gold transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="hover:text-atreus-gold transition-colors">Políticas de Envío</a></li>
              <li><a href="#" className="hover:text-atreus-gold transition-colors">Devoluciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-atreus-gold"/> Hernandarias, PY</li>
              <li className="flex items-center gap-2"><MessageCircle size={16} className="text-atreus-gold"/> +595 999 999 999</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-atreus-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 tracking-wider">
            © {new Date().getFullYear()} Atreus Parfums. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 opacity-50">
            {/* Payment Icons Placeholder */}
            <div className="h-6 w-10 bg-white/10 rounded"></div>
            <div className="h-6 w-10 bg-white/10 rounded"></div>
            <div className="h-6 w-10 bg-white/10 rounded"></div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Glassmorphism Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-atreus-black/95 backdrop-blur-2xl border-l border-white/5 z-50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
          >
            {/* Header del Carrito */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-black/20">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2">
                Mi Bolsa <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">{cart.length}</span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Barra de Progreso de Envío Gratis (Gamificación) */}
            <div className="px-6 py-4 bg-atreus-gold/5 border-b border-atreus-gold/10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] text-gray-300 font-medium">
                  {amountToFreeShipping > 0 
                    ? `Faltan ${formatPrice(amountToFreeShipping)} para envío gratis` 
                    : '¡Tienes envío gratis desbloqueado!'}
                </span>
                <Truck size={14} className={amountToFreeShipping <= 0 ? 'text-green-400' : 'text-atreus-gold'} />
              </div>
              <div className="w-full bg-black rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${amountToFreeShipping <= 0 ? 'bg-green-400' : 'bg-atreus-gold'}`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag size={56} strokeWidth={1} className="opacity-10 text-white mb-2" />
                  <p className="text-base font-serif text-white">Tu bolsa está vacía</p>
                  <p className="text-sm text-gray-500 text-center max-w-[250px]">Parece que aún no has encontrado tu esencia perfecta.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wide rounded-sm hover:bg-atreus-gold transition-colors"
                  >
                    Volver a la tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 group bg-black/20 p-3 rounded-lg border border-white/5 relative">
                      <div className="w-20 h-24 bg-[#0a0a0a] rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="pr-6">
                          <h4 className="font-medium text-white text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
                        </div>
                        <p className="text-sm font-semibold text-white mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-black rounded border border-white/10">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors"
                            >-</button>
                            <span className="text-xs w-6 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors"
                            >+</button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalCart)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envío</span>
                    {amountToFreeShipping > 0 ? (
                      <span className="text-xs">A calcular en WhatsApp</span>
                    ) : (
                      <span className="text-green-400 font-medium">Gratis</span>
                    )}
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-white/10">
                    <span className="font-serif text-white">Total</span>
                    <span className="text-2xl font-semibold text-white">{formatPrice(totalCart)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-atreus-gold hover:bg-atreus-gold-light text-black py-4 rounded-sm text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-btn hover:shadow-glow"
                >
                  <ShieldCheck size={18} />
                  Completar Compra
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <ShieldCheck size={12} /> Pago seguro y validación de stock vía WhatsApp
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
