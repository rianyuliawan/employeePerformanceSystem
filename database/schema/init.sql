CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_name VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone_encrypted TEXT NOT NULL,
  address_encrypted TEXT NOT NULL,
  department_id UUID NOT NULL REFERENCES departments(id),
  position_id UUID NOT NULL REFERENCES positions(id),
  hire_date DATE NOT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  wallet_address VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evaluation_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  manager_id UUID NOT NULL,
  period_id UUID NOT NULL REFERENCES evaluation_periods(id),
  total_score DECIMAL(5,2) NOT NULL,
  encrypted_comment TEXT NOT NULL,
  document_path TEXT,
  document_hash VARCHAR(64) NOT NULL,
  blockchain_status VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evaluation_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  indicator VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  weight DECIMAL(5,2) NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS promotion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id),
  requested_position UUID NOT NULL REFERENCES positions(id),
  requested_by UUID NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promotion_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  old_position UUID NOT NULL REFERENCES positions(id),
  new_position UUID NOT NULL REFERENCES positions(id),
  approved_by UUID NOT NULL,
  promoted_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id),
  contract_address VARCHAR(255) NOT NULL,
  transaction_hash VARCHAR(255) UNIQUE NOT NULL,
  block_number BIGINT,
  wallet_address VARCHAR(255) NOT NULL,
  network VARCHAR(50) NOT NULL,
  sync_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  activity VARCHAR(150) NOT NULL,
  ip_address VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_evaluations_employee ON evaluations(employee_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_manager ON evaluations(manager_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_hash ON blockchain_transactions(transaction_hash);

INSERT INTO roles (role_name)
VALUES ('HR'), ('Manager'), ('Director'), ('Employee')
ON CONFLICT (role_name) DO NOTHING;

