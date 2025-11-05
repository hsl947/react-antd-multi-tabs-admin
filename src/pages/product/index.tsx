import React, { useState } from 'react';
import { Layout, Tree, Table, Card, Button, Space, Input, Select, Tag, Drawer } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  PlusOutlined, 
  DownOutlined, 
  EyeOutlined, 
  EditOutlined, 
  CopyOutlined, 
  MoreOutlined 
} from '@ant-design/icons';
import './index.less';

const { Sider, Content } = Layout;
const { Option } = Select;

// Mock product categories
const productCategories = [
  { title: '服饰', key: 'clothing', children: [
    { title: '男装', key: 'men' },
    { title: '女装', key: 'women' },
    { title: '童装', key: 'kids' }
  ] },
  { title: '数码', key: 'electronics', children: [
    { title: '手机', key: 'phones' },
    { title: '电脑', key: 'computers' },
    { title: '配件', key: 'accessories' }
  ] },
  { title: '食品', key: 'food', children: [
    { title: '零食', key: 'snacks' },
    { title: '饮料', key: 'drinks' },
    { title: '生鲜', key: 'fresh' }
  ] }
];

// Mock product data (500 items)
const generateMockProducts = () => {
  const products = [];
  const categories = ['clothing', 'electronics', 'food'];
  const statuses = ['上架', '下架', '预售'];
  const brands = ['品牌A', '品牌B', '品牌C', '品牌D', '品牌E'];
  
  for (let i = 1; i <= 500; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    products.push({
      id: i,
      name: `商品${i}`,
      subtitle: `${brand} ${category}系列产品`,
      sku: `SKU${100000 + i}`,
      barcode: `BC${200000 + i}`,
      price: Math.floor(Math.random() * 1000) + 100,
      memberPrice: Math.floor(Math.random() * 900) + 90,
      activityPrice: Math.floor(Math.random() * 800) + 80,
      totalStock: Math.floor(Math.random() * 1000) + 10,
      availableStock: Math.floor(Math.random() * 500) + 5,
      sales7d: Math.floor(Math.random() * 200) + 1,
      salesTotal: Math.floor(Math.random() * 1000) + 10,
      status,
      category,
      brand,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      thumbnail: `https://picsum.photos/seed/product${i}/100/100`
    });
  }
  return products;
};

const ProductManagement: React.FC = () => {
  const [products] = useState(generateMockProducts());
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Table columns
  const columns = [
    {
      title: '选择',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Input.Checkbox />,
      fixed: 'left',
      width: 60
    },
    {
      title: '商品缩略图',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (text: string) => <img src={text} alt="商品缩略图" className="product-thumbnail" />,
      fixed: 'left',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div className="product-name">{text}</div>
          <div className="product-subtitle">{record.subtitle}</div>
        </div>
      ),
      width: 200
    },
    {
      title: '售价',
      dataIndex: 'price',
      key: 'price',
      render: (text: number, record: any) => (
        <div>
          <span className="original-price">¥{text}</span>
          <span className="member-price">会员价 ¥{record.memberPrice}</span>
          <span className="activity-price">活动价 ¥{record.activityPrice}</span>
        </div>
      ),
      width: 180
    },
    {
      title: '库存',
      dataIndex: 'totalStock',
      key: 'totalStock',
      render: (text: number, record: any) => (
        <div>
          <span className={record.availableStock < 10 ? 'stock-low' : ''}>
            总库存: {text} / 可售: {record.availableStock}
          </span>
        </div>
      ),
      width: 120
    },
    {
      title: '销售数据',
      dataIndex: 'sales7d',
      key: 'sales7d',
      render: (text: number, record: any) => (
        <div>
          <div>近7天: {text}</div>
          <div>累计: {record.salesTotal}</div>
        </div>
      ),
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let statusColor = 'green';
        if (text === '下架') statusColor = 'red';
        if (text === '预售') statusColor = 'orange';
        return <Tag color={statusColor}>{text}</Tag>;
      },
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />}>预览</Button>
          <Button type="text" icon={<EditOutlined />}>编辑</Button>
          <Button type="text" icon={<CopyOutlined />}>复制</Button>
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
      width: 180
    }
  ];
  
  // Filtered products based on current filters
  const filteredProducts = products.filter(product => {
    if (selectedCategory.length > 0 && !selectedCategory.includes(product.category)) {
      return false;
    }
    if (statusFilter && product.status !== statusFilter) {
      return false;
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword) ||
        product.barcode.toLowerCase().includes(keyword)
      );
    }
    return true;
  });
  
  // Paginated products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  return (
    <Layout className="product-management-layout">
      {/* Left Category Sider */}
      <Sider width={250} className="category-sider">
        <div className="sider-header">商品分类</div>
        <Tree
          defaultExpandAll
          treeData={productCategories}
          onSelect={setSelectedCategory}
        />
      </Sider>
      
      {/* Main Content */}
      <Layout>
        {/* Top Operation Area */}
        <div className="top-operation-area">
          <Space size="middle">
            <Select
              placeholder="商品状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="">全部</Option>
              <Option value="上架">上架</Option>
              <Option value="下架">下架</Option>
              <Option value="预售">预售</Option>
            </Select>
            
            <Input
              placeholder="搜索商品名称/SKU/条形码"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ width: 300 }}
            />
            
            <Button icon={<FilterOutlined />} onClick={() => setAdvancedFilterVisible(true)}>
              高级筛选
            </Button>
            
            <Select
              placeholder="批量操作"
              suffixIcon={<DownOutlined />}
              style={{ width: 150 }}
            >
              <Option value="online">批量上架</Option>
              <Option value="offline">批量下架</Option>
              <Option value="delete">批量删除</Option>
              <Option value="export">导出</Option>
            </Select>
            
            <Button type="primary" icon={<PlusOutlined />}>
              新增商品
            </Button>
          </Space>
        </div>
        
        {/* Product List */}
        <Content className="product-list-content">
          <Card>
            <Table
              columns={columns}
              dataSource={paginatedProducts}
              rowKey="id"
              pagination={{ 
                current: currentPage, 
                pageSize: pageSize, 
                total: filteredProducts.length,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                showSizeChanger: true,
                pageSizeOptions: ['20', '50', '100', '200']
              }}
              scroll={{ x: 1200 }}
              bordered={false}
            />
          </Card>
        </Content>
      </Layout>
      
      {/* Right Details Preview */}
      <Sider width={350} className="details-sider">
        <div className="sider-header">商品详情预览</div>
        {selectedProduct ? (
          <div className="product-details">
            <img src={selectedProduct.thumbnail} alt="商品图片" className="details-image" />
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.subtitle}</p>
            <div className="details-info">
              <div>售价: ¥{selectedProduct.price}</div>
              <div>库存: {selectedProduct.totalStock}</div>
              <div>状态: {selectedProduct.status}</div>
            </div>
          </div>
        ) : (
          <div className="no-selection">请选择商品查看详情</div>
        )}
      </Sider>
      
      {/* Advanced Filter Drawer */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setAdvancedFilterVisible(false)}
        visible={advancedFilterVisible}
        width={400}
      >
        <div className="filter-content">
          <div className="filter-item">
            <label>价格区间:</label>
            <Space>
              <Input placeholder="最小值" style={{ width: 120 }} />
              <span>-</span>
              <Input placeholder="最大值" style={{ width: 120 }} />
            </Space>
          </div>
          <div className="filter-item">
            <label>品牌:</label>
            <Select mode="multiple" placeholder="选择品牌" style={{ width: '100%' }}>
              <Option value="brandA">品牌A</Option>
              <Option value="brandB">品牌B</Option>
              <Option value="brandC">品牌C</Option>
            </Select>
          </div>
          <div className="filter-item">
            <label>标签:</label>
            <Select mode="multiple" placeholder="选择标签" style={{ width: '100%' }}>
              <Option value="hot">热门</Option>
              <Option value="new">新品</Option>
              <Option value="discount">折扣</Option>
            </Select>
          </div>
          <div className="filter-buttons">
            <Button onClick={() => setAdvancedFilterVisible(false)}>重置</Button>
            <Button type="primary" onClick={() => setAdvancedFilterVisible(false)}>确定</Button>
          </div>
        </div>
      </Drawer>
    </Layout>
  );
};

export default ProductManagement;