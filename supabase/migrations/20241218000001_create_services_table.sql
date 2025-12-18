-- Create services table for CMS management
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RM',
    features JSONB NOT NULL DEFAULT '[]',
    description TEXT,
    duration VARCHAR(100),
    note TEXT,
    images JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_sort_order ON services(sort_order);

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Services policies (public read for active services, authenticated write)
CREATE POLICY "Active services are viewable by everyone" ON services
    FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert services" ON services
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services" ON services
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete services" ON services
    FOR DELETE USING (auth.role() = 'authenticated');

-- Function to get services by category
CREATE OR REPLACE FUNCTION get_services_by_category(
    filter_category VARCHAR(50) DEFAULT NULL,
    filter_status VARCHAR(20) DEFAULT 'active'
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    category VARCHAR(50),
    price DECIMAL(10,2),
    currency VARCHAR(3),
    features JSONB,
    description TEXT,
    duration VARCHAR(100),
    note TEXT,
    images JSONB,
    status VARCHAR(20),
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.category,
        s.price,
        s.currency,
        s.features,
        s.description,
        s.duration,
        s.note,
        s.images,
        s.status,
        s.sort_order,
        s.created_at,
        s.updated_at
    FROM services s
    WHERE 
        (filter_category IS NULL OR s.category = filter_category)
        AND (filter_status IS NULL OR s.status = filter_status)
    ORDER BY s.sort_order ASC, s.created_at DESC;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;