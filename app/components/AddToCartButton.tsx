import { type FetcherWithComponents } from '@remix-run/react';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { motion } from 'framer-motion';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines:   
 Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}   

          />
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#4f535a' }}
            whileTap={{ scale: 0.95, backgroundColor: '#6b6e72' }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="rounded bg-zinc-950 text-zinc-100 py-2 px-4"
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </motion.button>
        </>
      )}
    </CartForm>
  );
}