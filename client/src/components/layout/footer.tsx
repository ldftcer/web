import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-10 bg-card mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="text-primary text-2xl font-bold mb-4">MovieStream</div>
            <p className="text-muted-foreground max-w-md">
              Watch unlimited movies and TV shows on your phone, tablet, laptop, and TV.
            </p>
            <div className="mt-4 flex space-x-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <FacebookIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <TwitterIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <InstagramIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <YoutubeIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <a className="text-muted-foreground hover:text-primary transition">Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Action">
                    <a className="text-muted-foreground hover:text-primary transition">Movies</a>
                  </Link>
                </li>
                <li>
                  <Link href="/?category=TV">
                    <a className="text-muted-foreground hover:text-primary transition">TV Shows</a>
                  </Link>
                </li>
                <li>
                  <Link href="/my-list">
                    <a className="text-muted-foreground hover:text-primary transition">My List</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms">
                    <a className="text-muted-foreground hover:text-primary transition">Terms of Use</a>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <a className="text-muted-foreground hover:text-primary transition">Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/cookie">
                    <a className="text-muted-foreground hover:text-primary transition">Cookie Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/copyright">
                    <a className="text-muted-foreground hover:text-primary transition">Copyright</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help">
                    <a className="text-muted-foreground hover:text-primary transition">Help Center</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="text-muted-foreground hover:text-primary transition">Contact Us</a>
                  </Link>
                </li>
                <li>
                  <Link href="/faq">
                    <a className="text-muted-foreground hover:text-primary transition">FAQ</a>
                  </Link>
                </li>
                <li>
                  <Link href="/devices">
                    <a className="text-muted-foreground hover:text-primary transition">Devices</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-muted text-center text-muted-foreground/50">
          <p>© {new Date().getFullYear()} MovieStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
