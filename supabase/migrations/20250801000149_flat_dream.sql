/*
  # Fix Users Table RLS Policies

  1. Security Updates
    - Add proper RLS policies for users table
    - Allow authenticated users to manage their own profiles
    - Enable SELECT, INSERT, and UPDATE operations for own data

  2. Policy Details
    - Users can read their own profile data
    - Users can create their own profile during signup
    - Users can update their own profile information
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for INSERT: Users can create their own profile
CREATE POLICY "Users can create own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);