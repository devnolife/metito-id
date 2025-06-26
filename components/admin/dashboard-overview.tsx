"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, Award, TrendingUp, Eye, MessageCircle, Star, Activity } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+12%",
      icon: Package,
      color: "primary-blue",
    },
    {
      title: "Customer Inquiries",
      value: "156",
      change: "+23%",
      icon: MessageCircle,
      color: "accent-orange",
    },
    {
      title: "Page Views",
      value: "8,432",
      change: "+18%",
      icon: Eye,
      color: "water-blue",
    },
    {
      title: "Certifications",
      value: "12",
      change: "+2",
      icon: Award,
      color: "primary-blue",
    },
  ]

  const recentActivities = [
    { action: "New product added", item: "RO Membrane System 2000 GPD", time: "2 hours ago" },
    { action: "Customer inquiry", item: "UV Disinfection System", time: "4 hours ago" },
    { action: "Blog post published", item: "Water Treatment Trends 2024", time: "1 day ago" },
    { action: "Gallery updated", item: "Municipal Project Photos", time: "2 days ago" },
    { action: "Certification added", item: "ISO 14001:2015", time: "3 days ago" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary-blue mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your water treatment business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-primary-blue">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-accent-orange rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-primary-blue">
              <TrendingUp className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                <Package className="w-8 h-8 text-primary-blue mb-2" />
                <p className="font-medium text-primary-blue">Add Product</p>
                <p className="text-xs text-gray-600">Create new equipment</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">
                <Users className="w-8 h-8 text-accent-orange mb-2" />
                <p className="font-medium text-accent-orange">View Inquiries</p>
                <p className="text-xs text-gray-600">Customer messages</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200 hover:bg-cyan-100 transition-colors cursor-pointer">
                <Star className="w-8 h-8 text-water-blue mb-2" />
                <p className="font-medium text-water-blue">Add Review</p>
                <p className="text-xs text-gray-600">Customer testimonial</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                <Award className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-medium text-green-600">Add Certificate</p>
                <p className="text-xs text-gray-600">Quality certification</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
