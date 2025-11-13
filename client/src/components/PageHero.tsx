import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  bgImage?: string;
}

const PageHero = ({ title, subtitle, breadcrumbs, bgImage }: PageHeroProps) => {
  return (
    <div className="relative bg-gradient-to-r from-dark via-dark-light to-dark text-white py-20">
      {/* Background Image */}
      {bgImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover opacity-10"
          />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link to="/" className="flex items-center hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-300">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Title and Subtitle */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHero;
