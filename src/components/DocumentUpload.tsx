
import React, { useState } from 'react';
import { Upload, File, Eye, Download, Shield, X, CheckCircle } from 'lucide-react';
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
  file?: File;
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
  const [dragActive, setDragActive] = useState(false);

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

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploadedBy: currentUser,
          uploadDate: new Date(),
          isRequired: true,
          category: 'property',
          file: file
        };
        setDocuments(prev => [...prev, newDoc]);
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const downloadDocument = (doc: Document) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // For demo documents, create a placeholder file
      const content = `This is a placeholder for ${doc.name}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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

  const getUploadedDocsForCategory = (category: string) => {
    return documents.filter(doc => doc.category === category && doc.uploadedBy === currentUser);
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
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Upload Documents</p>
              <p className="text-sm text-gray-500">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              />
              <label htmlFor="file-upload">
                <Button className="cursor-pointer">Choose Files</Button>
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT
              </p>
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
              {requiredDocuments[currentUser].map((req, index) => {
                const uploadedDocs = getUploadedDocsForCategory(req.category as any);
                const isUploaded = uploadedDocs.length > 0;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        isUploaded ? 'bg-green-500' : req.required ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{req.name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(req.category)}>
                            {req.category}
                          </Badge>
                          {isUploaded && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Uploaded
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant={req.required ? "destructive" : "secondary"}>
                      {req.required ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                );
              })}
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
            <div className="space-y-3 max-h-96 overflow-y-auto">
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadDocument(doc)}
                    >
                      {doc.uploadedBy === currentUser ? (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                    {doc.uploadedBy === currentUser && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
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
