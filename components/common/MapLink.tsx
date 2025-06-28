import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapLinkProps {
  address: string;
  name?: string;
}

export const MapLink = ({ address, name }: MapLinkProps) => {
  const searchQuery = name ? `${name} ${address}` : address;
  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

  return (
    <Button
      variant="outline"
      onClick={() => window.open(googleMapsUrl, '_blank')}
      className="flex items-center space-x-2"
    >
      <MapPin className="h-4 w-4" />
      <span>Google Mapsで開く</span>
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
}; 