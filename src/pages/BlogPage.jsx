import React from 'react';

const blogPosts = [
  {
    id: 1,
    author: 'Dr. Nguyễn Văn A',
    role: 'Chuyên gia y tế',
    title: 'Tác hại của thuốc lá đến sức khỏe phổi',
    content: 'Thuốc lá chứa hơn 7000 chất độc hại, ảnh hưởng nghiêm trọng đến phổi, gây ra các bệnh như viêm phế quản, ung thư phổi và COPD.',
  },
  {
    id: 2,
    author: 'Nguyễn Minh Khang',
    role: 'Người đã cai thuốc',
    title: 'Cách tôi đã bỏ thuốc thành công sau 10 năm hút',
    content: 'Tôi đã áp dụng phương pháp chia nhỏ mục tiêu, tập thể dục mỗi ngày và tham gia cộng đồng hỗ trợ để bỏ thuốc thành công.',
  },
  {
    id: 3,
    author: 'Dr. Lê Thị Hạnh',
    role: 'Chuyên gia tâm lý',
    title: 'Cai thuốc không chỉ là ý chí mà còn cần môi trường',
    content: 'Môi trường sống tích cực, gia đình và bạn bè ủng hộ là yếu tố then chốt giúp bạn tránh tái nghiện.',
  },
];

const BlogPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Chia Sẻ Kinh Nghiệm Cai Thuốc</h1>
      {blogPosts.map((post) => (
        <div key={post.id} className="mb-6 p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-sm text-gray-500">Tác giả: {post.author} ({post.role})</p>
          <p className="mt-2 text-gray-700">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogPage;
