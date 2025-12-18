-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, authenticated write)
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Projects policies (authenticated users only)
CREATE POLICY "Authenticated users can view projects" ON projects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert projects" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects" ON projects
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');

-- Content policies (public read for published, authenticated for all)
CREATE POLICY "Published content is viewable by everyone" ON content
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert content" ON content
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update content" ON content
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete content" ON content
    FOR DELETE USING (auth.role() = 'authenticated');

-- Content versions policies (authenticated users only)
CREATE POLICY "Authenticated users can view content versions" ON content_versions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert content versions" ON content_versions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Content collections policies (public read for public collections)
CREATE POLICY "Public collections are viewable by everyone" ON content_collections
    FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert collections" ON content_collections
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update collections" ON content_collections
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete collections" ON content_collections
    FOR DELETE USING (auth.role() = 'authenticated');

-- Content collection items policies
CREATE POLICY "Collection items follow collection visibility" ON content_collection_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM content_collections cc 
            WHERE cc.id = collection_id 
            AND (cc.is_public = true OR auth.role() = 'authenticated')
        )
    );

CREATE POLICY "Authenticated users can manage collection items" ON content_collection_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Analytics policies (insert for everyone, read for authenticated)
CREATE POLICY "Anyone can insert analytics" ON content_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics" ON content_analytics
    FOR SELECT USING (auth.role() = 'authenticated');