import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SupplierPortal = () => {
  const [formData, setFormData] = useState({
    purchaseOrderNumber: '',
    purchaseOrderLineNumber: '',
    geoJsonFiles: [],
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      geoJsonFiles: [...e.target.files],
    }));
  };

  const validateGeoJson = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          if (content.type && content.type === 'FeatureCollection' && content.features) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Validating...');

    // Validate GeoJSON files
    const validations = await Promise.all(formData.geoJsonFiles.map(validateGeoJson));
    if (validations.some((valid) => !valid)) {
      setSubmitStatus('Error: Invalid GeoJSON file(s)');
      return;
    }

    // TODO: Implement actual API submission
    setSubmitStatus('Data submitted successfully');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supplier Data Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
            <Input
              id="purchaseOrderNumber"
              name="purchaseOrderNumber"
              value={formData.purchaseOrderNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseOrderLineNumber">Purchase Order Line Number</Label>
            <Input
              id="purchaseOrderLineNumber"
              name="purchaseOrderLineNumber"
              value={formData.purchaseOrderLineNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="geoJsonFiles">GeoJSON Files</Label>
            <Input
              id="geoJsonFiles"
              name="geoJsonFiles"
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".json,.geojson"
              required
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
        {submitStatus && <p className="mt-4 text-sm">{submitStatus}</p>}
      </CardContent>
    </Card>
  );
};

export default SupplierPortal;
