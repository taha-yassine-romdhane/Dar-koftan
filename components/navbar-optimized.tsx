"use client";

import Link from "next/link";
import { Menu, X, LogOut, ShoppingBag, Settings } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SearchBar from "@/components/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { isIOS } from "@/lib/device-detection";

interface Subcategory {
  name: string;
  query?: string;
  href?: string;
  group?: string;
}

interface Category {
  label: string;
  subcategories?: Subcategory[];
  url?: string;
}

// Static categories that will always be shown
const staticCategories: Category[] = [
  {
    label: "Promo",
    url: "/promo",
  },
  {
    label: "Top Vente",
    url: "/top-vente",
  },
];

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [loading, setLoading] = useState(true);
  const [isIosDevice, setIsIosDevice] = useState(false);
  
  // Track if component is mounted for memory safety
  const isMountedRef = useRef(true);

  // Detect iOS device for optimizations
  useEffect(() => {
    setIsIosDevice(isIOS());
    
    // Set mounted flag
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Optimize toggle menu for performance
  const toggleMenu = () => {
    // Prevent body scroll when menu is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    setIsOpen(!isOpen);
    setOpenCategory(null);
  };

  // Optimize category toggle with debounce for mobile
  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        
        // Group categories by their group (FEMME, ENFANT, ACCESSOIRE)
        const categoryGroups: Record<string, any[]> = {};
        
        data.categories.forEach((category: any) => {
          // Extract the group from the category or default to FEMME
          const group = category.group || 'FEMME';
          
          if (!categoryGroups[group]) {
            categoryGroups[group] = [];
          }
          
          categoryGroups[group].push(category);
        });
        
        // Function to convert technical group names to user-friendly display names
        const getGroupDisplayName = (technicalName: string): string => {
          switch (technicalName) {
            case 'FEMME': return 'Femme';
            case 'ENFANT': return 'Enfants';
            case 'ACCESSOIRE': return 'Accessoires';
            default: return technicalName;
          }
        };
        
        // Define the order we want to display groups in
        const groupOrder = ['FEMME', 'ENFANT', 'ACCESSOIRE'];
        
        // Transform grouped categories and ensure they're in the correct order
        const groupedCategories = groupOrder
          .filter(group => categoryGroups[group] && categoryGroups[group].length > 0) // Only include groups that exist
          .map(groupName => ({
            label: getGroupDisplayName(groupName),
            subcategories: categoryGroups[groupName].map(category => ({
              name: category.name,
              query: category.name.toLowerCase().replace(/\s+/g, '-'),
              group: category.group, // Keep the technical group name for API calls
            })),
          }));
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          // Combine grouped categories with static categories
          setCategories([...groupedCategories, ...staticCategories]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };
    
    fetchCategories();
  }, []);

  // Handle click outside to close menu - optimized with passive event listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setOpenCategory(null);
        document.body.style.overflow = '';
      }
    };

    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="border-b relative z-50">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between bg-white">
          <div className="flex items-center">
            <Button
              onClick={toggleMenu}
              className="p-2 lg:hidden text-[#D4AF37] hover:bg-[#D4AF37]/10"
              variant="ghost"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <Link href="/" className="ml-4 lg:ml-0">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={70}
                height={70}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 h-full">
            <ul className="flex space-x-8 h-full">
              {categories.map((category) => (
                <li key={category.label} className="relative group h-16 flex items-center">
                  {category.url ? (
                    <Link
                      href={category.url}
                      className="text-gray-800 hover:text-[#D4AF37] transition-colors py-2 block"
                    >
                      {category.label}
                    </Link>
                  ) : (
                    <div className="relative">
                      <button
                        className="text-gray-800 hover:text-[#D4AF37] transition-colors py-2 flex items-center"
                        onClick={() => toggleCategory(category.label)}
                        onMouseEnter={() => toggleCategory(category.label)}
                      >
                        {category.label}
                      </button>
                      {category.subcategories && (
                        <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-56 bg-white shadow-lg rounded-md border border-[#D4AF37]/20 z-50 overflow-hidden">
                          <ul className="py-1">
                            {category.subcategories.map((subcategory) => (
                              <li key={subcategory.name}>
                                <Link
                                  href={`/collections?category=${subcategory.query}&group=${subcategory.group}`}
                                  className="block px-4 py-2 text-gray-700 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors"
                                >
                                  {subcategory.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side - Search, Cart, and Auth */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <SearchBar />
            </div>

            <Link
              href="/cart"
              className="relative text-gray-800 hover:text-[#D4AF37] transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[#D4AF37] text-white text-xs flex items-center justify-center">
                  {items.length}
                </div>
              )}
            </Link>

            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative h-8 w-8 bg-[#D4AF37] hover:bg-[#D4AF37]/80 rounded-full"
                  >
                    <div className="flex items-center justify-center h-full w-full bg-[#D4AF37] text-white rounded-full">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Derniére connexion: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="w-full">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Mes commandes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Deconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-[#D4AF37] transition-colors"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="bg-[#D4AF37] text-white hover:bg-[#B59851] transition-colors"
                  >
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu - Optimized for performance */}
        <div
          ref={menuRef}
          className={`lg:hidden fixed top-[64px] left-0 right-0 bottom-0 bg-white overflow-y-auto z-50 border-t border-[#D4AF37]/20 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isIosDevice ? 'ios-optimized' : ''}`}
          aria-hidden={!isOpen}
        >
          <div className="sticky top-0 p-4 bg-white shadow-sm">
            <SearchBar />
          </div>
          <div className="px-4 py-2">
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.label}>
                  {category.url ? (
                    <Link
                      href={category.url}
                      className="block w-full py-2 text-gray-800 hover:text-[#D4AF37] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleCategory(category.label)}
                        className="flex items-center justify-between w-full py-2 text-gray-800 hover:text-[#D4AF37] transition-colors"
                      >
                        <span>{category.label}</span>
                        {openCategory === category.label ? (
                          <X size={18} />
                        ) : (
                          <Menu size={18} />
                        )}
                      </button>
                      {/* Lazy load subcategories only when category is open */}
                      {category.subcategories && openCategory === category.label && (
                        <ul className="ml-4 mt-1 space-y-2 border-l-2 border-[#D4AF37]/20 pl-4">
                          {/* Only render the first 10 subcategories for performance */}
                          {category.subcategories.slice(0, 10).map((subcategory) => (
                            <li key={subcategory.name}>
                              <Link
                                href={`/collections?category=${subcategory.query}&group=${subcategory.group}`}
                                onClick={() => setIsOpen(false)}
                                className="block py-1.5 text-gray-600 hover:text-[#D4AF37] transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </li>
                          ))}
                          {/* Show "See More" if there are more than 10 subcategories */}
                          {category.subcategories.length > 10 && (
                            <li>
                              <Link
                                href={`/collections?group=${category.subcategories[0]?.group}`}
                                onClick={() => setIsOpen(false)}
                                className="block py-1.5 text-[#D4AF37] font-medium hover:underline"
                              >
                                Voir plus ({category.subcategories.length - 10})
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
