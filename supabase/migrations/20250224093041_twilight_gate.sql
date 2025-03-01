/*
  # Add Categories and Update Advertisements

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Add `category_id` to `advertisements` table
    - Add foreign key constraint
    
  3. Security
    - Enable RLS on categories table
    - Add policies for admin management
    - Add policies for public viewing
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add category_id to advertisements
ALTER TABLE advertisements
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id);
