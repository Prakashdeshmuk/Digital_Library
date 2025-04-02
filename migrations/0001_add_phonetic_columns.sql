-- Custom SQL migration file, put your code below! --
-- Update the new columns with phonetic values
UPDATE books
SET 
  title_phonetic = dmetaphone(title),
  author_phonetic = dmetaphone(author),
  genre_phonetic = dmetaphone(genre);  -- Convert timestamp to text

-- Create function to update phonetic codes automatically
CREATE OR REPLACE FUNCTION update_phonetic_codes()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title_phonetic := dmetaphone(NEW.title);
  NEW.author_phonetic := dmetaphone(NEW.author);
  NEW.genre_phonetic := dmetaphone(NEW.genre);  -- Convert timestamp to text
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update phonetic codes before INSERT/UPDATE
CREATE TRIGGER books_phonetic_trigger
BEFORE INSERT OR UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION update_phonetic_codes();

-- Create indexes for the new phonetic columns
CREATE INDEX idx_title_phonetic ON books (title_phonetic);
CREATE INDEX idx_author_phonetic ON books (author_phonetic);
CREATE INDEX idx_genre_phonetic ON books (genre_phonetic);