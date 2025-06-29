
import React, { useState } from 'react';
import { Upload, File, Eye, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: 'buyer' | 'seller';
  uploadDate: Date;
  isRequired: boolean;
  category: 'identity' | 'financial' | 'property' | 'legal';
}

interface DocumentUploadProps {
  currentUser: 'buyer' | 'seller';
}

const DocumentUpload = ({ currentUser }: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Property_Deed.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'seller',
      uploadDate: new Date(),
      isRequired: true,
      category: 'property'
    },
    {
      id: '2',
      name: 'Bank_Statement.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'buyer',
      uploadDate: new Date(),
      isRequired: true,
      category: 'financial'
    }
  ]);

  const requiredDocuments = {
    buyer: [
      { category: 'identity', name: 'Government ID', required: true },
      { category: 'financial', name: 'Bank Statement', required: true },
      { category: 'financial', name: 'Proof of Funds', required: true },
      { category: 'legal', name: 'Legal Representation Letter', required: false }
    ],
    seller: [
      { category: 'identity', name: 'Government ID', required: true },
      { category: 'property', name: 'Property Deed/Title', required: true },
      { category: 'property', name: 'Property Survey', required: true },
      { category: 'legal', name: 'Power of Attorney (if applicable)', required: false }
    ]
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.split('/')[1].toUpperCase(),
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploadedBy: currentUser,
          uploadDate: new Date(),
          isRequired: true,
          category: 'property'
        };
        setDocuments(prev => [...prev, newDoc]);
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'identity': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'property': return 'bg-purple-100 text-purple-800';
      case 'legal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Document Upload Center
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload required documents for the transaction. All documents are encrypted and secure.
          </p>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Upload Documents</p>
              <p className="text-sm text-gray-500">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload">
                <Button className="cursor-pointer">Choose Files</Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <p className="text-sm text-gray-600">
              Documents you need to upload as {currentUser}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requiredDocuments[currentUser].map((req, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      req.required ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{req.name}</p>
                      <Badge className={getCategoryColor(req.category)}>
                        {req.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={req.required ? "destructive" : "secondary"}>
                    {req.required ? 'Required' : 'Optional'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <p className="text-sm text-gray-600">
              View and manage uploaded documents
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>by {doc.uploadedBy}</span>
                        <Badge className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.uploadedBy !== currentUser && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        <span>View Only</span>
                      </div>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {doc.uploadedBy !== currentUser && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentUpload;
