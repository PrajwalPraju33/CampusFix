-- ============================================================================
-- CAMPUSFIX - AI-POWERED CAMPUS MAINTENANCE AND COMPLAINT MANAGEMENT SYSTEM
-- INSTITUTION: THE NATIONAL INSTITUTE OF ENGINEERING (NIE), MYSORE
-- INITIAL CAMPUS: NIE NORTH CAMPUS
-- DATABASE SCHEMA DEFINITION (MySQL 8.x)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS campusfix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campusfix;

-- Drop tables in reverse dependency order if recreating
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS status_history;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS buildings;
DROP TABLE IF EXISTS campuses;
DROP TABLE IF EXISTS institutions;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. INSTITUTIONS TABLE
CREATE TABLE institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. CAMPUSES TABLE
CREATE TABLE campuses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campuses_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE CASCADE,
    INDEX idx_campuses_institution (institution_id)
) ENGINE=InnoDB;

-- 3. BUILDINGS TABLE
CREATE TABLE buildings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campus_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_buildings_campus FOREIGN KEY (campus_id) 
        REFERENCES campuses(id) ON DELETE CASCADE,
    INDEX idx_buildings_campus (campus_id)
) ENGINE=InnoDB;

-- 4. USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL,
    institution_id BIGINT,
    campus_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_campus FOREIGN KEY (campus_id) 
        REFERENCES campuses(id) ON DELETE SET NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- 5. COMPLAINTS TABLE
CREATE TABLE complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_number VARCHAR(50) NOT NULL UNIQUE,
    institution_id BIGINT NOT NULL,
    campus_id BIGINT NOT NULL,
    building_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    problem_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    room_lab_no VARCHAR(100) NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    status ENUM(
        'SUBMITTED',
        'VERIFIED',
        'ASSIGNED',
        'IN_PROGRESS',
        'RESOLUTION_SUBMITTED',
        'CLOSED',
        'REJECTED',
        'ON_HOLD',
        'REOPENED'
    ) DEFAULT 'SUBMITTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaints_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE CASCADE,
    CONSTRAINT fk_complaints_campus FOREIGN KEY (campus_id) 
        REFERENCES campuses(id) ON DELETE CASCADE,
    CONSTRAINT fk_complaints_building FOREIGN KEY (building_id) 
        REFERENCES buildings(id) ON DELETE CASCADE,
    CONSTRAINT fk_complaints_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_complaints_number (complaint_number),
    INDEX idx_complaints_status (status),
    INDEX idx_complaints_user (user_id),
    INDEX idx_complaints_campus_building (campus_id, building_id)
) ENGINE=InnoDB;

-- 6. ASSIGNMENTS TABLE
CREATE TABLE assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    assigned_to VARCHAR(150) NOT NULL,
    assigned_by VARCHAR(150) NOT NULL,
    remarks TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignments_complaint FOREIGN KEY (complaint_id) 
        REFERENCES complaints(id) ON DELETE CASCADE,
    INDEX idx_assignments_complaint (complaint_id)
) ENGINE=InnoDB;

-- 7. STATUS_HISTORY TABLE
CREATE TABLE status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) 
        REFERENCES complaints(id) ON DELETE CASCADE,
    INDEX idx_history_complaint (complaint_id)
) ENGINE=InnoDB;

-- 8. ATTACHMENTS TABLE
CREATE TABLE attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachments_complaint FOREIGN KEY (complaint_id) 
        REFERENCES complaints(id) ON DELETE CASCADE,
    INDEX idx_attachments_complaint (complaint_id)
) ENGINE=InnoDB;

-- 9. FEEDBACK TABLE
CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_complaint FOREIGN KEY (complaint_id) 
        REFERENCES complaints(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_feedback_complaint (complaint_id)
) ENGINE=InnoDB;
