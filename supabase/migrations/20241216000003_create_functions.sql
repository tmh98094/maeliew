-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(content_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE content 
    SET view_count = view_count + 1 
    WHERE id = content_uuid;
    
    -- Also insert analytics record
    INSERT INTO content_analytics (content_id, event_type)
    VALUES (content_uuid, 'view');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(content_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE content 
    SET download_count = download_count + 1 
    WHERE id = content_uuid;
    
    -- Also insert analytics record
    INSERT INTO content_analytics (content_id, event_type)
    VALUES (content_uuid, 'download');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get content with category and project info
CREATE OR REPLACE FUNCTION get_content_with_details(
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0,
    filter_status content_status DEFAULT NULL,
    filter_type content_type DEFAULT NULL,
    filter_category UUID DEFAULT NULL,
    filter_project UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    type content_type,
    status content_status,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    tags TEXT[],
    keywords TEXT[],
    view_count INTEGER,
    download_count INTEGER,
    category_name VARCHAR(255),
    category_color VARCHAR(7),
    project_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.description,
        c.type,
        c.status,
        c.file_path,
        c.file_name,
        c.file_size,
        c.mime_type,
        c.width,
        c.height,
        c.alt_text,
        c.tags,
        c.keywords,
        c.view_count,
        c.download_count,
        cat.name as category_name,
        cat.color as category_color,
        p.name as project_name,
        c.created_at,
        c.updated_at,
        c.published_at
    FROM content c
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN projects p ON c.project_id = p.id
    WHERE 
        (filter_status IS NULL OR c.status = filter_status)
        AND (filter_type IS NULL OR c.type = filter_type)
        AND (filter_category IS NULL OR c.category_id = filter_category)
        AND (filter_project IS NULL OR c.project_id = filter_project)
    ORDER BY c.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search content
CREATE OR REPLACE FUNCTION search_content(
    search_term TEXT,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    type content_type,
    status content_status,
    file_path VARCHAR(500),
    category_name VARCHAR(255),
    project_name VARCHAR(255),
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.description,
        c.type,
        c.status,
        c.file_path,
        cat.name as category_name,
        p.name as project_name,
        (
            CASE 
                WHEN c.title ILIKE '%' || search_term || '%' THEN 3.0
                ELSE 0.0
            END +
            CASE 
                WHEN c.description ILIKE '%' || search_term || '%' THEN 2.0
                ELSE 0.0
            END +
            CASE 
                WHEN search_term = ANY(c.tags) THEN 2.5
                ELSE 0.0
            END +
            CASE 
                WHEN search_term = ANY(c.keywords) THEN 2.0
                ELSE 0.0
            END
        ) as relevance_score
    FROM content c
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN projects p ON c.project_id = p.id
    WHERE 
        c.title ILIKE '%' || search_term || '%'
        OR c.description ILIKE '%' || search_term || '%'
        OR search_term = ANY(c.tags)
        OR search_term = ANY(c.keywords)
        OR cat.name ILIKE '%' || search_term || '%'
        OR p.name ILIKE '%' || search_term || '%'
    ORDER BY relevance_score DESC, c.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get analytics summary
CREATE OR REPLACE FUNCTION get_content_analytics_summary(
    content_uuid UUID DEFAULT NULL,
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_views BIGINT,
    total_downloads BIGINT,
    unique_visitors BIGINT,
    top_referrers TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN ca.event_type = 'view' THEN 1 END) as total_views,
        COUNT(CASE WHEN ca.event_type = 'download' THEN 1 END) as total_downloads,
        COUNT(DISTINCT ca.ip_address) as unique_visitors,
        ARRAY_AGG(DISTINCT ca.referrer) FILTER (WHERE ca.referrer IS NOT NULL) as top_referrers
    FROM content_analytics ca
    WHERE 
        (content_uuid IS NULL OR ca.content_id = content_uuid)
        AND ca.created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;