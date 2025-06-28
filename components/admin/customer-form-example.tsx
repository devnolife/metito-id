"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from './image-upload'

interface UploadedImage {
  id: string
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  title?: string
  description?: string
  altText?: string
}

export function CustomerFormExample() {
  const [customerImages, setCustomerImages] = useState<UploadedImage[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    avatar: ''
  })

  const handleImageUpload = (images: UploadedImage[]) => {
    setCustomerImages(prev => [...prev, ...images])
  }

  const handleImageDelete = (imageId: string) => {
    setCustomerImages(prev => prev.filter(img => img.id !== imageId))
  }

  const handleSubmit = () => {
    // Handle form submission with images
    console.log('Customer data:', formData)
    console.log('Customer images:', customerImages)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Enter company name"
            />
          </div>
        </div>

        {/* Customer Avatar Upload */}
        <div>
          <Label>Customer Avatar</Label>
          <ImageUpload
            category="customers"
            onUploadComplete={handleImageUpload}
            onImageDelete={handleImageDelete}
            existingImages={customerImages}
            maxFiles={1}
            className="mt-2"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Add Customer
        </Button>
      </CardContent>
    </Card>
  )
} 
