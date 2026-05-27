import { prisma } from '@/lib/prisma';
import { FileText, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [articleCount, testimonialCount, recentArticles] = await Promise.all([
    prisma.article.count({ where: { isActive: true } }),
    prisma.testimonial.count({ where: { isActive: true } }),
    prisma.article.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
  ]);

  const stats = [
    { name: 'Total Articles', value: articleCount, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Testimonials', value: testimonialCount, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-light text-[#333333] mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back. Here is what&apos;s happening with Park Legal.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[420px]">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center shrink-0">
            <h2 className="text-lg font-medium text-gray-800">Recent Articles</h2>
            <Link href="/admin/news" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {recentArticles.map((article) => (
              <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span className="bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{article.category}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {recentArticles.length === 0 && (
              <div className="p-12 text-center text-gray-400 italic h-full flex items-center justify-center">
                No recent articles found.
              </div>
            )}
          </div>
        </div>

        {/* Admin Help */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Admin Help</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Need assistance? Use the sidebar to navigate between sections. For image uploads, ensure files are under 5MB for optimal performance.
          </p>
        </div>
      </div>
    </div>
  );
}
