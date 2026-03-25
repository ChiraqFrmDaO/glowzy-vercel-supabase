import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, Globe, Shield, BarChart3, Zap, CreditCard, Bitcoin, Gift, Check, AlertTriangle, ChevronRight, User, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ImageHost() {
  const { profile, setProfile } = useAuth();
  const [open, setOpen] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [selectedGiftProduct, setSelectedGiftProduct] = useState<string | null>(null);
  const [giftUsername, setGiftUsername] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const features = [
    { icon: Globe, title: "Add Custom Image Host Domain", desc: "Use your own domain for image hosting" },
    { icon: Image, title: "Public Domains", desc: "Access to shared public image host domains" },
    { icon: Shield, title: "Exclusive Badge", desc: "Show off your Image Host badge on your profile" },
    { icon: Zap, title: "Fast & Secure Uploads", desc: "High-speed CDN with secure storage" },
    { icon: BarChart3, title: "Advanced Image Gallery", desc: "Full gallery management and organisation" },
    { icon: BarChart3, title: "Upload Analytics", desc: "Track your uploads, views and bandwidth" },
  ];

  const giftProducts = [
    { id: "verified", name: "guns.lol Verified", desc: "Gift Verified Badge", price: "14,99€", discount: null },
    { id: "badge", name: "guns.lol Custom Badge", desc: "Gift Custom Badge", price: "8,99€", discount: null },
    { id: "premium", name: "guns.lol Premium", desc: "Gift Premium Lifetime", price: "6,99€", discountPrice: "6,29€", discount: "Save 10%" },
    { id: "imagehost", name: "guns.lol Image Host", desc: "Gift Image Host", price: "4,99€", discount: null },
  ];

  const hasImageHost = profile?.has_image_host;

  const handlePurchase = () => {
    if (hasImageHost) {
      setShowCancelConfirm(true);
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentPurchase = async (method: string) => {
    setPurchasing(true);
    setShowPaymentModal(false);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_imagehost_lifetime",
          paymentMethod: method,
          successUrl: `${window.location.origin}/dashboard/image-host?purchase=success`,
          cancelUrl: `${window.location.origin}/dashboard/image-host?purchase=cancelled`,
        }),
      });
      if (!response.ok) throw new Error("Failed to create checkout session");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Image Host purchase error:", error);
      alert("Failed to start purchase. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancelImageHost = async () => {
    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/cancel-image-host", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel");
      }
      const data = await response.json();
      setCancelMessage(data.message);
      setShowCancelConfirm(false);
      if (setProfile) {
        setProfile({ ...profile, has_image_host: false });
      }
    } catch (error: any) {
      console.error("Cancel image host error:", error);
      alert("Failed to cancel: " + error.message);
    } finally {
      setCancelling(false);
    }
  };

  const handleGiftContinue = async () => {
    if (!selectedGiftProduct || !giftUsername) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/create-gift-checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: selectedGiftProduct,
          recipientUsername: giftUsername,
          message: giftMessage,
          successUrl: `${window.location.origin}/dashboard/image-host?gift=success`,
          cancelUrl: `${window.location.origin}/dashboard/image-host`,
        }),
      });
      if (!response.ok) throw new Error("Failed to create gift checkout");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Gift error:", error);
      alert("Failed to process gift. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg glass rounded-2xl p-6 relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-premium to-primary flex items-center justify-center mx-auto mb-4 glow-accent">
                <Image className="w-7 h-7 text-premium-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {hasImageHost ? "Image Host Active" : "Purchase Image Host"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {hasImageHost
                  ? "You have access to all Image Host features"
                  : "Upload and share images instantly with custom domains and an image gallery."}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-premium/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-premium" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.title}</p>
                    <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Price */}
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-foreground">
                {hasImageHost ? "Active" : "4,99€"}
              </span>
              {!hasImageHost && (
                <span className="text-muted-foreground text-sm">/Lifetime</span>
              )}
              {!hasImageHost && (
                <p className="text-xs text-premium mt-1">Pay once. Keep it forever.</p>
              )}
            </div>

            {/* Cancel success message */}
            {cancelMessage && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {cancelMessage}
                </div>
              </div>
            )}

            {/* Purchase + Gift buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-premium to-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {purchasing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : hasImageHost ? (
                  <>
                    <Image className="w-4 h-4" />
                    Manage Image Host
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Purchase
                  </>
                )}
              </button>

              {/* Gift button */}
              {!hasImageHost && (
                <button
                  onClick={() => setShowGiftModal(true)}
                  className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 border border-border flex items-center justify-center transition-colors"
                  title="Gift Image Host"
                >
                  <Gift className="w-5 h-5 text-premium" />
                </button>
              )}
            </div>

            {!hasImageHost && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                Learn more at{" "}
                <a href="https://guns.lol/pricing" className="text-premium hover:underline">
                  https://guns.lol/pricing
                </a>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 rounded-xl bg-premium text-premium-foreground font-medium hover:bg-premium/90 transition-colors"
        >
          <Image className="w-4 h-4 inline mr-2" />
          {hasImageHost ? "Manage Image Host" : "Purchase Image Host"}
        </button>
      )}

      {/* Payment Method Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-2xl p-6 m-4 bg-card border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground text-lg">Purchase Image Host</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product info */}
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-premium/20 flex items-center justify-center">
                  <Image className="w-5 h-5 text-premium" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Image Host Lifetime</p>
                  <p className="text-xs text-muted-foreground">One-time payment of 4,99€</p>
                </div>
              </div>

              {/* Card option */}
              <button
                onClick={() => handlePaymentPurchase("card")}
                className="w-full mb-2 p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border hover:border-premium/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-premium transition-colors" />
                  <span className="text-sm font-medium text-foreground">Card</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <span className="px-1.5 py-0.5 bg-background rounded text-[10px] border border-border">VISA</span>
                  <span className="px-1.5 py-0.5 bg-background rounded text-[10px] border border-border">MC</span>
                  <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-[10px] text-blue-400 border border-blue-500/30">PayPal</span>
                  <span className="px-1.5 py-0.5 bg-background rounded text-[10px] border border-border">⬛ Pay</span>
                  <span className="px-1.5 py-0.5 bg-background rounded text-[10px] border border-border">G Pay</span>
                </div>
              </button>

              {/* Crypto option */}
              <button
                onClick={() => handlePaymentPurchase("crypto")}
                className="w-full p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border hover:border-premium/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Bitcoin className="w-5 h-5 text-muted-foreground group-hover:text-premium transition-colors" />
                  <span className="text-sm font-medium text-foreground">Crypto</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">₿</span>
                  <span className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">Ł</span>
                  <span className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">₮</span>
                  <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-white text-[9px] font-bold">M</span>
                  <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">Ξ</span>
                  <span className="text-muted-foreground">+ more</span>
                </div>
              </button>

              <button
                onClick={() => handlePaymentPurchase("card")}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-premium to-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Purchase
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Modal */}
      <AnimatePresence>
        {showGiftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setShowGiftModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-2xl p-6 m-4 bg-card border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground text-lg">Gift Image Host</h3>
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Gifter badge banner */}
              <div className="mb-5 p-3 rounded-xl bg-premium/20 border border-premium/30 flex items-center gap-2">
                <Gift className="w-4 h-4 text-premium flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Gift any product and earn the{" "}
                  <span className="text-premium font-medium">exclusive</span> Gifter badge!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Left: illustration */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 bg-premium/20 rounded-2xl" />
                    <div className="absolute inset-2 bg-premium/30 rounded-xl flex items-center justify-center">
                      <Gift className="w-16 h-16 text-premium opacity-60" />
                    </div>
                    <Sparkles className="absolute top-2 left-2 w-4 h-4 text-premium/60" />
                    <Sparkles className="absolute bottom-4 right-2 w-3 h-3 text-premium/40" />
                  </div>
                </div>

                {/* Right: form */}
                <div className="col-span-2 md:col-span-1 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Send To</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Username"
                        value={giftUsername}
                        onChange={(e) => setGiftUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-premium/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Gift Message</label>
                    <textarea
                      placeholder="I hope you enjoy this gift!"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-premium/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Gift product selector */}
              <div className="mt-4">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Your Gift</label>
                <div className="space-y-2">
                  {giftProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedGiftProduct(product.id)}
                      className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between text-left ${
                        selectedGiftProduct === product.id
                          ? "border-premium/60 bg-premium/10"
                          : "border-border bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{product.name}</span>
                          {product.discount && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-premium/20 text-premium rounded-full">
                              {product.discount}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{product.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        {product.discountPrice ? (
                          <div>
                            <span className="text-xs text-muted-foreground line-through mr-1">{product.price}</span>
                            <span className="text-sm font-semibold text-foreground">{product.discountPrice}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-foreground">{product.price}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGiftContinue}
                disabled={!selectedGiftProduct || !giftUsername}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-premium to-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6 m-4 bg-card border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Remove Image Host?</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">After removal:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your custom image host domain will be removed</li>
                  <li>• All uploaded images will be permanently deleted</li>
                  <li>• Your image gallery will no longer be accessible</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  Keep Image Host
                </button>
                <button
                  onClick={handleCancelImageHost}
                  disabled={cancelling}
                  className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin inline mr-2" />
                      Removing...
                    </>
                  ) : (
                    "Remove Image Host"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}