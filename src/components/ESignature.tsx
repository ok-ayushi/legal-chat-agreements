import React, { useState, useRef } from 'react';
import { PenTool, Check, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import jsPDF from 'jspdf';

interface ESignatureProps {
  currentUser: 'buyer' | 'seller';
  contractData: any;
  onSignatureComplete: (signatureData: any) => void;
}

const ESignature = ({ currentUser, contractData, onSignatureComplete }: ESignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [signerInfo, setSignerInfo] = useState({
    fullName: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const completeSignature = () => {
    if (!signerInfo.fullName) {
      alert('Please enter your full name');
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = {
        signature: canvas.toDataURL(),
        signerInfo: {
          ...signerInfo,
          userType: currentUser,
          timestamp: new Date().toISOString()
        }
      };
      setSignatureComplete(true);
      onSignatureComplete(signatureData);
    }
  };

  const downloadSignedContractPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LEGAL AGREEMENT CONTRACT', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Legally Binding Property Transaction Agreement', 105, 30, { align: 'center' });
    
    // Contract Details
    let yPosition = 50;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION DETAILS', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Contract Title: ${contractData.title}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Property Type: ${contractData.propertyType}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Transaction Amount: $${contractData.amount}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Timeline: ${contractData.timeline}`, 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION & TERMS', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Description: ${contractData.description || 'Not specified'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Payment Terms: ${contractData.paymentTerms || 'Not specified'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Legal Terms: ${contractData.legalTerms || 'Standard terms apply'}`, 20, yPosition);
    
    // Signature Section
    yPosition += 25;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DIGITAL SIGNATURE', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Signed by: ${signerInfo.fullName}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Title: ${signerInfo.title || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Date: ${signerInfo.date}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Location: ${signerInfo.location || 'Not specified'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Role: ${currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Signature Date: ${new Date().toLocaleString()}`, 20, yPosition);
    
    // Add signature image if available
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureDataURL = canvas.toDataURL('image/png');
      doc.addImage(signatureDataURL, 'PNG', 20, yPosition + 10, 80, 30);
    }
    
    // Footer
    yPosition += 50;
    doc.setFontSize(8);
    doc.text('This document has been digitally signed and is legally binding under applicable law.', 20, yPosition);
    doc.text(`Document generated on: ${new Date().toLocaleString()}`, 20, yPosition + 5);
    
    // Save the PDF
    doc.save(`${contractData.title}_Signed_Contract_${currentUser}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center">
          <PenTool className="h-6 w-6 mr-2" />
          Electronic Signature
        </h2>
        <p className="text-gray-600 mt-2">
          Sign the contract digitally to make it legally binding
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Contract Title:</strong> {contractData.title}</p>
              <p><strong>Amount:</strong> ${contractData.amount}</p>
            </div>
            <div>
              <p><strong>Property Type:</strong> {contractData.propertyType}</p>
              <p><strong>Timeline:</strong> {contractData.timeline}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!signatureComplete ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Signer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Legal Name *</Label>
                  <Input
                    id="fullName"
                    value={signerInfo.fullName}
                    onChange={(e) => setSignerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full legal name"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title/Position</Label>
                  <Input
                    id="title"
                    value={signerInfo.title}
                    onChange={(e) => setSignerInfo(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Property Owner, Agent"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={signerInfo.date}
                    onChange={(e) => setSignerInfo(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={signerInfo.location}
                    onChange={(e) => setSignerInfo(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Digital Signature</CardTitle>
              <p className="text-sm text-gray-600">
                Draw your signature in the box below using your mouse or touch screen
              </p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="border bg-white cursor-crosshair w-full max-w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={clearSignature}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Signature
                </Button>
                <Button 
                  onClick={completeSignature}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!signerInfo.fullName}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Complete Signature
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Signature Completed Successfully!
            </h3>
            <p className="text-green-700 mb-4">
              Your digital signature has been recorded and the contract is now legally binding.
            </p>
            <div className="space-y-2 text-sm text-green-700 mb-6">
              <p><strong>Signed by:</strong> {signerInfo.fullName}</p>
              <p><strong>Date:</strong> {signerInfo.date}</p>
              <p><strong>Role:</strong> {currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}</p>
            </div>
            <Button onClick={downloadSignedContractPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download Signed Contract (PDF)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ESignature;
