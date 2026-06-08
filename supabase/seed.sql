-- Seoul alpha seed placeholder.
-- Add verified alpha content after source review.

insert into public.regions (slug, name_en, name_ko, intro, best_for_tags, status)
values
  ('myeongdong', 'Myeongdong', '명동', 'Beginner-friendly Seoul food area for first-time visitors.', array['street_food', 'first_time'], 'draft'),
  ('hongdae', 'Hongdae', '홍대', 'Youthful Seoul area for casual food, cafes, and nightlife.', array['nightlife', 'solo_travel'], 'draft'),
  ('gangnam', 'Gangnam', '강남', 'Modern Seoul dining area for polished K-food and trend-driven restaurants.', array['premium', 'modern'], 'draft'),
  ('jongno', 'Jongno', '종로', 'Old Seoul food area with traditional soups, pancakes, and alley routes.', array['traditional', 'history'], 'draft'),
  ('gwangjang-market', 'Gwangjang Market', '광장시장', 'Market food area known for classic Seoul street food.', array['market', 'street_food'], 'draft')
on conflict (slug) do nothing;
