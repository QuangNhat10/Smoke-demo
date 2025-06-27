// Trang BlogAPI.jsx - Quản lý giao diện và logic cho blog cộng đồng cai thuốc lá
// Sử dụng React hooks để quản lý trạng thái và hiệu ứng
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import SecondaryNavigation from "../components/SecondaryNavigation";
import postApi from "../api/postApi";

const BlogAPI = () => {
  // Hook điều hướng
  const navigate = useNavigate();
  // Danh sách bài viết
  const [posts, setPosts] = useState([]);
  // Danh sách danh mục
  const [categories, setCategories] = useState([]);
  // Danh mục đang chọn
  const [activeCategory, setActiveCategory] = useState("all");
  // Từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // Trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);
  // Trạng thái đang tìm kiếm
  const [isSearching, setIsSearching] = useState(false);
  // Từ khóa tìm kiếm cuối cùng
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  // Set lưu các bài viết đã xem
  const [viewedPosts, setViewedPosts] = useState(new Set());
  // Trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Hiển thị form tạo/sửa bài viết
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Bài viết đang chỉnh sửa
  const [editingPost, setEditingPost] = useState(null);
  // Dữ liệu bài viết mới hoặc đang chỉnh sửa
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
  });

  // Kiểm tra đăng nhập và tải danh mục khi load trang
  useEffect(() => {
    // Kiểm tra cả cờ userLoggedIn và token
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const token = localStorage.getItem("token");
    const actuallyLoggedIn = userLoggedIn && token;
    setIsLoggedIn(actuallyLoggedIn);
    loadCategories();
  }, []);

  // Tải lại bài viết khi đổi danh mục
  useEffect(() => {
    loadPosts();
  }, [activeCategory]);

  // Tự động tìm kiếm khi xóa từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm === "") {
      setLastSearchTerm("");
      loadPosts();
    } else {
      // Reset lastSearchTerm khi người dùng nhập mới
      if (searchTerm.trim() !== lastSearchTerm) {
        setLastSearchTerm("");
      }
    }
  }, [searchTerm]);

  // Theo dõi lượt xem bài viết khi danh sách bài viết thay đổi
  useEffect(() => {
    if (posts.length > 0) {
      // Sau 2s sẽ tự động tăng view cho các bài chưa xem
      const timer = setTimeout(() => {
        posts.forEach((post) => {
          if (!viewedPosts.has(post.postID)) {
            console.log("🔍 Auto-tracking view for post:", post.postID);
            handlePostView(post.postID);
          }
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [posts]);

  // Hàm tải bài viết từ API
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const filters = {
        category: activeCategory === "all" ? null : activeCategory,
        search: searchTerm || null,
        page: 1,
        pageSize: 10,
      };
      console.log("🔄 Loading posts with filters:", filters);
      const data = await postApi.getPosts("Blog", filters);
      console.log("📨 API response:", data);
      // Xử lý dữ liệu trả về từ backend
      if (data && Array.isArray(data)) {
        setPosts(data);
      } else if (data && data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("❌ Error loading posts:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm tải danh mục từ API
  const loadCategories = async () => {
    try {
      const data = await postApi.getCategories("Blog");
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      // Nếu lỗi thì dùng danh mục mặc định
      setCategories([
        "Kinh nghiệm",
        "Sức khỏe",
        "Phương pháp",
        "Động lực",
        "Chia sẻ",
      ]);
    }
  };

  // Xử lý tạo bài viết mới
  const handleCreatePost = async () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      toast.error("Vui lòng đăng nhập để tạo bài viết.");
      navigate("/login");
      return;
    }
    // Kiểm tra dữ liệu bắt buộc
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast.error(
        "Vui lòng điền đầy đủ thông tin bắt buộc: Tiêu đề, Nội dung, Danh mục"
      );
      return;
    }
    try {
      const postData = {
        ...newPost,
        postType: "Blog",
      };
      const createdPost = await postApi.createPost(postData);
      toast.success("Tạo bài viết thành công!");
      setShowCreateForm(false);
      setNewPost({ title: "", content: "", category: "", tags: [] });
      // Tải lại danh sách bài viết
      await loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Không thể tạo bài viết. Vui lòng thử lại.");
    }
  };

  // Xử lý like bài viết
  const handleLikePost = async (postId) => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thích bài viết");
      return;
    }
    try {
      await postApi.likePost(postId);
      loadPosts();
    } catch (error) {
      console.error("Lỗi khi thích bài viết:", error);
      toast.error("Không thể thích bài viết");
    }
  };

  // Bắt đầu chỉnh sửa bài viết
  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags || [],
    });
    setShowCreateForm(true);
  };

  // Xử lý cập nhật bài viết
  const handleUpdatePost = async () => {
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      toast.error("Vui lòng đăng nhập để sửa bài viết.");
      return;
    }
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    try {
      const updateData = {
        ...newPost,
        postType: "Blog",
      };
      await postApi.updatePost(editingPost.postID, updateData);
      toast.success("Cập nhật bài viết thành công!");
      setShowCreateForm(false);
      setEditingPost(null);
      setNewPost({ title: "", content: "", category: "", tags: [] });
      await loadPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Không thể cập nhật bài viết. Vui lòng thử lại.");
    }
  };

  // Xử lý xóa bài viết
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      toast.error("Vui lòng đăng nhập để xóa bài viết.");
      return;
    }
    try {
      await postApi.deletePost(postId);
      toast.success("Xóa bài viết thành công!");
      await loadPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Không thể xóa bài viết. Vui lòng thử lại.");
    }
  };

  // Hủy chỉnh sửa/tạo bài viết
  const cancelEdit = () => {
    setShowCreateForm(false);
    setEditingPost(null);
    setNewPost({ title: "", content: "", category: "", tags: [] });
  };

  // Kiểm tra quyền sở hữu bài viết
  const isOwner = (post) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    return currentUser.userId === post.userID;
  };

  // Xử lý tìm kiếm thủ công
  const handleManualSearch = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentTerm = searchTerm.trim();
    if (!currentTerm || isSearching) return;
    // Tránh tìm kiếm trùng lặp
    if (currentTerm === lastSearchTerm && lastSearchTerm !== "") {
      return;
    }
    setIsSearching(true);
    setLastSearchTerm(currentTerm);
    try {
      await loadPosts();
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Xử lý tăng lượt xem bài viết
  const handlePostView = async (postId) => {
    // Chỉ track view một lần cho mỗi bài viết
    if (viewedPosts.has(postId)) {
      return;
    }
    try {
      const response = await postApi.incrementView(postId);
      setViewedPosts((prev) => new Set([...prev, postId]));
      // Cập nhật view count trong state để UI cập nhật ngay
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postID === postId
            ? { ...post, views: (post.views || 0) + 1 }
            : post
        )
      );
    } catch (error) {
      console.error("❌ Error tracking view for post:", postId, error);
    }
  };

  // Định dạng ngày tháng theo chuẩn Việt Nam
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Lấy màu cho badge danh mục
  const getBadgeColor = (category) => {
    const colors = {
      "Kinh nghiệm": "#3498db",
      "Sức khỏe": "#e74c3c",
      "Phương pháp": "#2ecc71",
      "Động lực": "#9b59b6",
      "Chia sẻ": "#f39c12",
    };
    return colors[category] || "#95a5a6";
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#2C9085",
        }}
      >
        <div>Đang tải dữ liệu blog...</div>
      </div>
    );
  }

  // Giao diện chính của trang Blog
  return (
    <div
      lang="vi"
      className="vietnamese-text"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)",
      }}
    >
      <Header />
      <SecondaryNavigation />

      <div
        style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 2rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              color: "#2C9085",
              fontSize: "2.5rem",
              marginBottom: "1rem",
            }}
          >
            🌿 Cộng Đồng Cai Thuốc Lá
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Chia sẻ kinh nghiệm, trao đổi kiến thức và hỗ trợ lẫn nhau trên hành
            trình cai thuốc lá
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <div style={{ position: "relative", minWidth: "250px" }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleManualSearch(e);
                    }
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    paddingRight:
                      searchTerm && !isSearching ? "2.5rem" : "1rem",
                    borderRadius: "8px",
                    border: isSearching
                      ? "1px solid #2C9085"
                      : "1px solid #ddd",
                    fontSize: "1rem",
                    width: "100%",
                    boxSizing: "border-box",
                    outline: isSearching
                      ? "2px solid rgba(44, 144, 133, 0.2)"
                      : "none",
                  }}
                />
                {searchTerm && !isSearching && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{
                      position: "absolute",
                      right: "0.8rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      padding: "0",
                    }}
                    title="Xóa tìm kiếm"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={handleManualSearch}
                disabled={!searchTerm.trim() || isSearching}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    !searchTerm.trim() || isSearching ? "#ccc" : "#2C9085",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    !searchTerm.trim() || isSearching
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  minWidth: "100px",
                  justifyContent: "center",
                }}
                title={isSearching ? "Đang tìm kiếm..." : "Tìm kiếm ngay"}
              >
                {isSearching ? "⏳ Đang tìm..." : "🔍 Tìm"}
              </button>
            </div>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: "0.7rem 1.5rem",
                backgroundColor: "#2C9085",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(44, 144, 133, 0.3)",
              }}
            >
              ✍️ Tạo bài viết
            </button>
          )}
        </div>

        {showCreateForm && (
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e0e0e0",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#2C9085" }}>
              {editingPost ? "✏️ Chỉnh sửa bài viết" : "✨ Tạo bài viết mới"}
            </h3>

            <input
              type="text"
              placeholder="Tiêu đề bài viết"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.7rem",
                marginBottom: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />

            <select
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.7rem",
                marginBottom: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              <option value="">Chọn danh mục</option>
              <option value="Kinh nghiệm">🎯 Kinh nghiệm</option>
              <option value="Sức khỏe">❤️ Sức khỏe</option>
              <option value="Phương pháp">🛠️ Phương pháp</option>
              <option value="Động lực">💪 Động lực</option>
              <option value="Chia sẻ">💬 Chia sẻ</option>
            </select>

            <textarea
              placeholder="Nội dung bài viết"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              rows={6}
              style={{
                width: "100%",
                padding: "0.7rem",
                marginBottom: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />

            <input
              type="text"
              placeholder="Tags (phân cách bằng dấu phẩy, ví dụ: cai thuốc, kinh nghiệm, sức khỏe)"
              value={newPost.tags.join(", ")}
              onChange={(e) => {
                const tagsString = e.target.value;
                const tagsArray = tagsString
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                setNewPost({ ...newPost, tags: tagsArray });
              }}
              style={{
                width: "100%",
                padding: "0.7rem",
                marginBottom: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={editingPost ? handleUpdatePost : handleCreatePost}
                style={{
                  padding: "0.7rem 1.5rem",
                  backgroundColor: "#2C9085",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {editingPost ? "💾 Cập nhật" : "📝 Đăng bài"}
              </button>
              <button
                onClick={cancelEdit}
                style={{
                  padding: "0.7rem 1.5rem",
                  backgroundColor: "#ddd",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        )}

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {posts.map((post) => (
            <div
              key={post.postID}
              data-post-id={post.postID}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    👤
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold", color: "#2C9085" }}>
                      {post.userName || "Ẩn danh"}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>

                {post.category && (
                  <span
                    style={{
                      backgroundColor: getBadgeColor(post.category),
                      color: "white",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "15px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {post.category}
                  </span>
                )}
              </div>

              <h3
                style={{
                  color: "#333",
                  marginBottom: "1rem",
                  fontSize: "1.3rem",
                }}
              >
                {post.title}
              </h3>

              <p
                style={{
                  color: "#555",
                  lineHeight: "1.6",
                  marginBottom: "1.5rem",
                }}
              >
                {post.content && post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <div style={{ display: "flex", gap: "2rem" }}>
                  <button
                    onClick={() => handleLikePost(post.postID)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: post.isLiked ? "#e74c3c" : "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                    {post.isLiked ? "❤️" : "🤍"} {post.likes || 0}
                  </button>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                    💬 {post.comments?.length || 0}
                  </span>

                  <button
                    onClick={() => handlePostView(post.postID)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#666",
                      fontSize: "0.9rem",
                      padding: "0",
                    }}
                    title="Click để test view tracking"
                  >
                    👁️ {post.views || 0}
                  </button>
                </div>

                {isLoggedIn && isOwner(post) && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditPost(post)}
                      style={{
                        background: "none",
                        border: "1px solid #3498db",
                        color: "#3498db",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        transition: "all 0.2s ease",
                      }}
                      title="Chỉnh sửa bài viết"
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#3498db";
                        e.target.style.color = "white";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#3498db";
                      }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.postID)}
                      style={{
                        background: "none",
                        border: "1px solid #e74c3c",
                        color: "#e74c3c",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        transition: "all 0.2s ease",
                      }}
                      title="Xóa bài viết"
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#e74c3c";
                        e.target.style.color = "white";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#e74c3c";
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !isLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: "white",
              borderRadius: "12px",
              color: "#666",
            }}
          >
            <h3>🌱 Chưa có bài viết nào</h3>
            <p>
              Hãy là người đầu tiên chia sẻ kinh nghiệm cai thuốc lá của bạn!
            </p>
            {isLoggedIn && (
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  marginTop: "1rem",
                  padding: "0.7rem 1.5rem",
                  backgroundColor: "#2C9085",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ✍️ Tạo bài viết đầu tiên
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogAPI;
