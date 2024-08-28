import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import FlipLink from './animations/FlipLink';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import { motion } from "framer-motion";

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="header flex items-stretch justify-between px-4 md:px-8 py-2">
      <NavLink className="" prefetch="intent" to="/" end>
        <img
          src="app\assets\artcadia-logo-white.svg" // Adjust file path if needed
          alt="Artcadia Logo" // Add alt text for accessibility
          className="h-15 w-auto" // Adjust height and width as needed
        />
      </NavLink>
      <div className="flex space-x-4">
        
        <HeaderMenuMobileToggle />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">   

      <ul className="flex-col space-x-4"> 

      {/* predictive seacrch form */}
      <br />
      <br />
      <div className="predictive-search text-zinc-900 pb-10">
        <PredictiveSearchForm>
          {({ fetchResults, inputRef }) => (
            <div className="flex items-center w-full"> {/* Flex container for alignment */}
              <motion.input
                className="appearance-none rounded-lg bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              <motion.button
                className="flex items-center ml-2 bg-gray-100 text-zinc-400 hover:text-indigo-500 px-2 py-2 rounded-lg focus:outline-none"
                onClick={() => {
                  window.location.href = inputRef?.current?.value
                    ? `/search?q=${inputRef.current.value}`
                    : `/search`;
                }}
              >
                {/* Magnifying glass SVG remains unchanged */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>   

                </svg>
              </motion.button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>


        <li>
          <FlipLink
            href={"/"}
            className=""
            end
            onClick={closeAside}
            prefetch="intent"
            
            to="/"
          >
            Home
          </FlipLink>
        </li>
        <li>
          <FlipLink
            href={"/artists"}
            className=""
            end
            onClick={closeAside}
            prefetch="intent"
            
            to="/artists"
          >
            Artists
          </FlipLink>
        </li>
        <li>
          <FlipLink
            href={"/about-us"}
            className=""
            end
            onClick={closeAside}
            prefetch="intent"
            
            to="/about-us" // Assuming your about us page path is '/about-us'
          >
            About
          </FlipLink>
        </li>
        
        {/* Rest of your menu items can be added here */}
      </ul>
    </nav>
  );
}


function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className=" flex items-center justify-center w-10 h-10 rounded-5 bg-zinc-950 transition-bg duration-300 hover:bg-zinc-900 focus:outline-none"
      onClick={() => open('mobile')}
    >
      <svg
        className="w-6 h-6 text-gray-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </button>

  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
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
    color: isPending ? 'grey' : 'black',
  };
}
