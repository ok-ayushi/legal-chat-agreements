
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useContracts } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';

const PropertyListing = ({ currentUser, onCreateContract }) => {
  const { contracts, createContract } = useContracts();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    property_type: 'house',
    amount: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    features: ''
  });

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!propertyForm.title || !propertyForm.amount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in at least the title and price.',
        variant: 'destructive',
      });
      return;
    }

    const contractData = {
      title: propertyForm.title,
      description: propertyForm.description,
      property_type: propertyForm.property_type,
      amount: parseFloat(propertyForm.amount),
      deliverables: `Property: ${propertyForm.title}\nLocation: ${propertyForm.location}\nBedrooms: ${propertyForm.bedrooms}\nBathrooms: ${propertyForm.bathrooms}\nSquare Feet: ${propertyForm.square_feet}\nFeatures: ${propertyForm.features}`,
      legal_terms: 'Standard property sale terms and conditions apply.',
      payment_terms: 'Payment to be made according to agreed schedule.',
      timeline: '30-45 days for closing process.',
      status: 'draft'
    };

    const { data, error } = await createContract(contractData);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create property listing. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Property listing created successfully!',
      });
      setPropertyForm({
        title: '',
        description: '',
        property_type: 'house',
        amount: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        features: ''
      });
      setShowForm(false);
      if (onCreateContract) {
        onCreateContract(data);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setPropertyForm(prev => ({ ...prev, [field]: value }));
  };

  const filteredProperties = contracts.filter(contract =>
    contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.property_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Listings</h2>
          <p className="text-gray-600">Browse and manage property listings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>List Property</span>
        </Button>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>

      {/* Property Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>List New Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="Beautiful 3BR family home"
                    value={propertyForm.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Price *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="500000"
                    value={propertyForm.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property features, neighborhood, etc."
                  value={propertyForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <select
                    id="property_type"
                    value={propertyForm.property_type}
                    onChange={(e) => handleInputChange('property_type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={propertyForm.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="3"
                    value={propertyForm.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="2"
                    value={propertyForm.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input
                    id="square_feet"
                    type="number"
                    placeholder="1800"
                    value={propertyForm.square_feet}
                    onChange={(e) => handleInputChange('square_feet', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Additional Features</Label>
                <Input
                  id="features"
                  placeholder="Garage, Pool, Garden, etc."
                  value={propertyForm.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Create Listing
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Property Listings */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
            <p className="text-gray-600">Start by listing your first property!</p>
          </div>
        ) : (
          filteredProperties.map(property => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <Badge variant="secondary" className="capitalize">
                    {property.property_type}
                  </Badge>
                </div>
                <div className="flex items-center text-green-600 font-semibold text-xl">
                  <DollarSign className="h-5 w-5" />
                  {property.amount?.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {property.description}
                </p>
                
                {property.deliverables && (
                  <div className="space-y-2">
                    {property.deliverables.includes('Bedrooms:') && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.deliverables.match(/Bedrooms: (\d+)/)?.[1] || 'N/A'} bed</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bath className="h-4 w-4" />
                          <span>{property.deliverables.match(/Bathrooms: (\d+)/)?.[1] || 'N/A'} bath</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Square className="h-4 w-4" />
                          <span>{property.deliverables.match(/Square Feet: (\d+)/)?.[1] || 'N/A'} sqft</span>
                        </div>
                      </div>
                    )}
                    {property.deliverables.includes('Location:') && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{property.deliverables.match(/Location: ([^\n]+)/)?.[1] || 'Location not specified'}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <Badge variant={property.status === 'draft' ? 'secondary' : 'default'} className="capitalize">
                    {property.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyListing;
