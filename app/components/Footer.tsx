import { Suspense } from 'react';
import { Await, NavLink } from '@remix-run/react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <motion.footer
            className="footer bg-zinc-950 px-8 py-12 text-zinc-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </motion.footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu grid grid-cols-1 gap-4 md:grid-cols-3 items-start md:gap-8 p-10" role="navigation">
      {/* Logo and address block */}
      <div className="mb-4 md:mb-0">
        <img src="https://cdn.shopify.com/s/files/1/0644/6075/1013/files/artcadia-logo-white_3.png?v=1728394107"
          alt="Artcadia Gallery Logo"
          width="200"
        />
        <div className="flex-col mt-2">
          <p className="text-zinc-500">Kurfürstendamm 215, D-10719 Berlin, Germany</p>
          <p className="text-zinc-500">info@artcadia-gallery.com</p>
        </div>
      </div>

      {/* Footer links */}
      <div className="footer-links flex flex-col items-center md:items-start">
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url || item.title === "Search") return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a href={url} key={item.id} rel="noopener noreferrer" target="_blank" className="hover:underline mb-2">
              {item.title}
            </a>
          ) : (
            <NavLink
              end
              key={item.id}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
              className="hover:underline mb-2"
            >
              {item.title}
            </NavLink>
          );
        })}
      </div>

      {/* Social Media Links placed under Privacy Policy and Imprint */}
      <div className="social-media flex flex-col items-center md:items-start">
        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
        <div className="flex gap-6">
          <a href="https://www.instagram.com/artcadia_gallery/" target="_blank" rel="noopener noreferrer" className="text-zinc-100 hover:text-zinc-400">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100069652207242" target="_blank" rel="noopener noreferrer" className="text-zinc-100 hover:text-zinc-400">
            <FaFacebookF size={24} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-100 hover:text-zinc-400">
            <FaLinkedinIn size={24} />
          </a>
        </div>
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
