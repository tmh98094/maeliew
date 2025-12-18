-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE content_type AS ENUM ('image', 'video', 'document', 'text');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'deleted');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'completed', 'on_hold', 'cancelled');

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    client_name VARCHAR(255),
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content table (main CRM table for images/content)
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type content_type NOT NULL,
    status content_status DEFAULT 'draft',
    
    -- File information
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- Image specific metadata
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    
    -- SEO and metadata
    tags TEXT[], -- array of tags
    keywords TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Relationships
    category_id UUID REFERENCES categories(id),
    project_id UUID REFERENCES projects(id),
    
    -- Usage tracking
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create content_versions table for version control
CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    changes_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(content_id, version_number)
);

-- Create content_collections table for grouping content
CREATE TABLE content_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for content collections
CREATE TABLE content_collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES content_collections(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(collection_id, content_id)
);

-- Create analytics table for tracking content performance
CREATE TABLE content_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'share', etc.
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_category ON content(category_id);
CREATE INDEX idx_content_project ON content(project_id);
CREATE INDEX idx_content_created_at ON content(created_at);
CREATE INDEX idx_content_tags ON content USING GIN(tags);
CREATE INDEX idx_content_keywords ON content USING GIN(keywords);
CREATE INDEX idx_analytics_content_id ON content_analytics(content_id);
CREATE INDEX idx_analytics_event_type ON content_analytics(event_type);
CREATE INDEX idx_analytics_created_at ON content_analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_collections_updated_at BEFORE UPDATE ON content_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
('Photography', 'Professional photography work', '#FF6B6B'),
('Portfolio', 'Portfolio showcase items', '#4ECDC4'),
('Blog', 'Blog related content', '#45B7D1'),
('Services', 'Service related imagery', '#96CEB4'),
('About', 'About page content', '#FFEAA7'),
('General', 'General purpose content', '#DDA0DD');

-- Insert sample project
INSERT INTO projects (name, description, status, client_name) VALUES
('Mae Liew Portfolio Website', 'Main portfolio website showcasing photography and design work', 'active', 'Mae Liew');