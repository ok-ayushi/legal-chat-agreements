
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, FileText, Upload, PenTool, Shield, Users, LogOut, Home } from 'lucide-react';
import MessageInterface from '@/components/MessageInterface';
import OrderCreation from '@/components/OrderCreation';
import DocumentUpload from '@/components/DocumentUpload';
import ContractPreview from '@/components/ContractPreview';
import ESignature from '@/components/ESignature';
import PropertyListing from '@/components/PropertyListing';
import AuthPage from '@/components/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { useContracts } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { contracts } = useContracts();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState('buyer');
  const [currentView, setCurrentView] = useState('properties');
  const [selectedContract, setSelectedContract] = useState(null);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'You have been signed out successfully',
      });
    }
  };

  const handleCreateOrder = () => {
    setCurrentView('order');
  };

  const handleOrderCreated = (data) => {
    setSelectedContract(data);
    setCurrentView('contract');
  };

  const handleContractApproved = () => {
    setCurrentView('signature');
  };

  const handleSignatureComplete = (signatureData) => {
    console.log('Signature completed:', signatureData);
    toast({
      title: 'Success',
      description: 'Contract signed successfully!',
    });
    setCurrentView('properties');
  };

  const handlePropertyCreated = (propertyData) => {
    setSelectedContract(propertyData);
    toast({
      title: 'Success',
      description: 'Property listed successfully!',
    });
  };

  const getProgressStep = () => {
    switch (currentView) {
      case 'properties': return 1;
      case 'messaging': return 2;
      case 'order': return 3;
      case 'contract': return 4;
      case 'signature': return 5;
      default: return 1;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (currentView === 'order') {
    return (
      <OrderCreation
        currentUser={currentUser}
        onBack={() => setCurrentView('properties')}
        onCreateOrder={handleOrderCreated}
      />
    );
  }

  if (currentView === 'contract' && selectedContract) {
    return (
      <ContractPreview
        orderData={selectedContract}
        currentUser={currentUser}
        onApprove={handleContractApproved}
        onReject={() => setCurrentView('properties')}
      />
    );
  }

  if (currentView === 'signature' && selectedContract) {
    return (
      <ESignature
        currentUser={currentUser}
        contractData={selectedContract}
        onSignatureComplete={handleSignatureComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">LegalDeal</h1>
              </div>
              <Badge variant="secondary">Property Transaction Platform</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Role:</span>
                <Button
                  variant={currentUser === 'buyer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentUser('buyer')}
                >
                  Buyer
                </Button>
                <Button
                  variant={currentUser === 'seller' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentUser('seller')}
                >
                  Seller
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="pb-4">
            <div className="flex items-center justify-center space-x-4">
              {[
                { step: 1, label: 'Properties', icon: Home },
                { step: 2, label: 'Messaging', icon: MessageSquare },
                { step: 3, label: 'Create Order', icon: FileText },
                { step: 4, label: 'Review Contract', icon: Upload },
                { step: 5, label: 'E-Signature', icon: PenTool }
              ].map(({ step, label, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    getProgressStep() >= step 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    if (step === 1) setCurrentView('properties');
                    if (step === 2) setCurrentView('messaging');
                  }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  {step < 5 && (
                    <div className={`w-8 h-px mx-2 ${
                      getProgressStep() > step ? 'bg-blue-300' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={currentView === 'properties' ? 'properties' : 'messaging'} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              value="properties" 
              className="flex items-center space-x-2"
              onClick={() => setCurrentView('properties')}
            >
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messaging" 
              className="flex items-center space-x-2"
              onClick={() => setCurrentView('messaging')}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messaging</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-6">
            <PropertyListing
              currentUser={currentUser}
              onCreateContract={handlePropertyCreated}
            />
          </TabsContent>

          <TabsContent value="messaging" className="mt-6">
            <Card className="h-[600px]">
              <MessageInterface
                currentUser={currentUser}
                onCreateOrder={handleCreateOrder}
              />
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DocumentUpload currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-blue-600" />
                    Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Browse and list properties with secure transaction capabilities.
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{contracts.length} Listed</Badge>
                    <Button variant="outline" size="sm" onClick={() => setCurrentView('properties')}>
                      View Properties
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Secure messaging between buyers and sellers with file sharing.
                  </p>
                  <Badge variant="secondary">Active</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    End-to-end encryption for all documents and communications.
                  </p>
                  <Badge variant="secondary">Protected</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="h-5 w-5 mr-2 text-purple-600" />
                    Legal Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Legally binding contracts with digital signatures and audit trails.
                  </p>
                  <Badge variant="secondary">Compliant</Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Platform Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">For Buyers</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Browse available properties</li>
                      <li>• Secure document upload and sharing</li>
                      <li>• Create purchase orders with legal terms</li>
                      <li>• Digital signature capabilities</li>
                      <li>• Real-time communication with sellers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">For Sellers</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• List properties with detailed information</li>
                      <li>• Property listing and documentation</li>
                      <li>• Create sales agreements with custom terms</li>
                      <li>• Secure client communication</li>
                      <li>• Legal compliance and audit trails</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
