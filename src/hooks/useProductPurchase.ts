import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useProductPurchase(productId: string) {
  const { data: session } = useSession();
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/check-purchase/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setIsPurchased(data.purchased);
        }
      } catch (error) {
        console.error('Error checking purchase status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPurchaseStatus();
  }, [productId, session]);

  return { isPurchased, loading };
} 