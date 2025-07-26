"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, TrendingUp, LogOut, ArrowUpRight, Activity, Users, Settings, FileText, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    activeUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.isAdmin) {
      router.push("/admin/login")
      return
    }

    fetchStats()
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-teal-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-300 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-teal-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error : any) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, trend, link }: any) => (
    <Link href={link || "#"}>
      <Card className="group relative overflow-hidden border border-gray-200 bg-white/90 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {trend && (
                  <div className="flex items-center text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{trend}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
              <Icon className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  {/* Updated QuickActionButton with better contrast */}
  const QuickActionButton = ({ href, children, icon: Icon }: any) => (
    <Button
      asChild
      variant="ghost"
      className="w-full justify-start h-14 text-left hover:bg-gray-100 hover:translate-x-1 transition-all duration-200 group px-4"
    >
      <Link href={href} className="flex items-center space-x-4">
        <div className="p-2 rounded-lg bg-teal-50 group-hover:bg-teal-100 transition-colors duration-200">
          <Icon className="h-5 w-5 text-teal-600" />
        </div>
        <span className="font-medium text-gray-800">{children}</span>
        <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-teal-500" />
      </Link>
    </Button>
  )

  return (
    <div className="min-h-screen text-gray-900 relative overflow-hidden">
    {/* Enhanced Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-teal-100/40 to-blue-100/40"></div>
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-pink-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-teal-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
    </div>

    <div className="relative z-10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header with better contrast */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-pink-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-teal-700 font-medium">Welcome back, Admin 👋</p>
          </div>
          <div className="flex gap-3">
           
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              // className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2 text-gray-600" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards with improved text contrast */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Products"
            value={isLoading ? "..." : stats.totalProducts}
            icon={Package}
            link="/admin/products"
          />
          <StatCard
            title="Total Orders"
            value={isLoading ? "..." : stats.totalOrders}
            icon={ShoppingCart}
            // link="/admin/orders"
          />
          <StatCard
            title="Revenue"
            value={isLoading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            // link="/admin/orders"
          />
        </div>

        {/* Main Content Grid with enhanced readability */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions Card with better text contrast */}
          <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <Activity className="h-5 w-5 text-teal-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your store quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickActionButton href="/admin/products" icon={Package}>
                Manage Products
              </QuickActionButton>
              <QuickActionButton href="/admin/sections" icon={FileText}>
                Manage Sections
              </QuickActionButton>
              <QuickActionButton href="/admin/bundles" icon={Package}>
                Manage Bundles
              </QuickActionButton>
              
            </CardContent>
          </Card>

          {/* Recent Orders Card with improved readability */}
          <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <ShoppingCart className="h-5 w-5 text-teal-600" />
                <span>Recent Orders</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                {stats.recentOrders.length} orders this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))
                ) : stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order: any) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="group block"
                    >
                      <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-teal-50 rounded-lg transition-all duration-200 border border-transparent hover:border-teal-100">
                        <div className="space-y-1">
                          <p className="font-semibold text-teal-700 group-hover:text-teal-600 transition-colors">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-600">{order.email}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-gray-800">₹{order.amount}</p>
                          <Badge 
                            variant={order.status === "delivered" ? "default" : "secondary"} 
                            className="capitalize bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No recent orders</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 bg-white border-gray-300 text-teal-600 hover:bg-teal-50 hover:border-teal-200"
                      asChild
                    >
                      <Link href="/admin/products">
                        Add Products
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

      {/* Add these styles for the animated blobs */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}