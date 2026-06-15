-- ============================================================
-- SOCORRA DATABASE SCHEMA
-- Supabase / PostgreSQL
-- Run in order — dependencies are respected top to bottom.
-- ============================================================
 
 
-- ============================================================
-- 1. SCHOOLS
-- ============================================================
CREATE TABLE schools (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  division    TEXT,
  region      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
 
 
-- ============================================================
-- 2. PROFILES
-- Extends Supabase auth.users (1-to-1).
-- Auto-populated via trigger on auth.users insert.
-- ============================================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('teacher', 'school_head')),
  school_id   UUID REFERENCES schools(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 3. SUBJECTS
-- ============================================================
CREATE TABLE subjects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  ww_weight   NUMERIC(3,2),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
 
 
-- ============================================================
-- 4. CLASSES
-- ============================================================
CREATE TABLE classes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id),
  subject_id    UUID NOT NULL REFERENCES subjects(id),
  grade_level   INT  NOT NULL CHECK (grade_level BETWEEN 7 AND 10),
  section_name  TEXT NOT NULL,
  school_year   TEXT NOT NULL,  -- e.g. '2025-2026'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
 
 
-- ============================================================
-- 5. STUDENTS
-- ============================================================
CREATE TABLE students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  full_name   TEXT NOT NULL,
  gender      TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 6. ASSESSMENTS
-- ============================================================
CREATE TABLE assessments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id      UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id    UUID NOT NULL REFERENCES profiles(id),
  title          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('formative', 'summative')),
  quarter       INT  NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  total_items   INT  NOT NULL CHECK (total_items BETWEEN 10 AND 50),
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized')),
  recomputation_needed BOOLEAN DEFAULT FALSE,
  answer_key_finalized_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
 
 
-- ============================================================
-- 7. COMPETENCIES
-- Reusable competency master list
-- ============================================================
CREATE TABLE competencies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT,             -- e.g. 'M7AL-Ia-1'
  description TEXT NOT NULL,
  subject     TEXT,
  grade_level INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
 

-- ============================================================
-- 8. ASSESSMENT COMPETENCIES
-- TOS: links competencies to a specific assessment with metadata
-- ============================================================
CREATE TABLE assessment_competencies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  competency_id   UUID NOT NULL REFERENCES competencies(id),
  no_of_meetings  INT NOT NULL,
  percentage      NUMERIC(6,2) NOT NULL,
  no_of_items     INT NOT NULL,
  UNIQUE (assessment_id, competency_id)
);

 
-- ============================================================
-- 9. ASSESSMENT ITEMS
-- ============================================================
CREATE TABLE assessment_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  competency_id   UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  item_number     INT  NOT NULL,
  cognitive_level TEXT NOT NULL CHECK (cognitive_level IN ('remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating')),
  difficulty_band TEXT NOT NULL CHECK (difficulty_band IN ('easy', 'medium', 'hard')),
  correct_answer  CHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  UNIQUE (assessment_id, item_number)
);
 
 
 - ============================================================
-- UUID v7 UPGRADE (high-volume tables)
-- Run once before creating answer_sheets & extracted_responses
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

 
-- ============================================================
-- 10. ANSWER SHEETS
-- student_id is NULL until OCR name is matched to the roster.
-- ============================================================
CREATE TABLE answer_sheets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  assessment_id     UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id        UUID REFERENCES students(id) ON DELETE SET NULL,
  image_url         TEXT NOT NULL,
  extracted_name    TEXT,       -- raw name extracted by OCR before matching
  match_confidence  NUMERIC(5,4),      -- RapidFuzz similarity score (0–1)
  student_confirmed    BOOLEAN DEFAULT FALSE,  -- true if teacher confirms the match
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','processing','review','finalized')),
  uploaded_at       TIMESTAMPTZ DEFAULT NOW(),
  finalized_at      TIMESTAMPTZ
);
 
 
-- ============================================================
-- 11. EXTRACTED RESPONSES
-- Stores per-item OCR output and manual override state.
-- ============================================================
CREATE TABLE extracted_responses (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  answer_sheet_id   UUID NOT NULL REFERENCES answer_sheets(id) ON DELETE CASCADE,
  assessment_id     UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  item_number       INT  NOT NULL,
  extracted_answer  CHAR(1) CHECK (extracted_answer IN ('A','B','C','D')),
  confidence_score  NUMERIC(5,4) NOT NULL DEFAULT 1.0,
  needs_review      BOOLEAN DEFAULT FALSE,   -- low confidence or ambiguous mark
  override_answer   CHAR(1) CHECK (override_answer IN ('A','B','C','D')),
  is_overridden     BOOLEAN DEFAULT FALSE,
  UNIQUE (answer_sheet_id, item_number)
);
 
 
-- ============================================================
-- 12. STUDENT SCORES
-- Computed and stored after all overrides are finalized.
-- ============================================================
CREATE TABLE student_scores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id     UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  answer_sheet_id   UUID NOT NULL REFERENCES answer_sheets(id) ON DELETE CASCADE,
  raw_score         INT   NOT NULL,
  percentage_score  NUMERIC(6,2) NOT NULL,
  is_finalized      BOOLEAN DEFAULT FALSE,
  computed_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (assessment_id, student_id)
);
 
 
-- ============================================================
-- 13. ITEM ANALYSIS
-- Computed after grading; stored for reporting.
-- ============================================================
CREATE TABLE item_analysis (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id       UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  assessment_item_id   UUID NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
  item_number         INT  NOT NULL,
  difficulty_index    NUMERIC(5,4),        -- proportion who answered correctly
  option_a_count      INT DEFAULT 0,
  option_b_count      INT DEFAULT 0,
  option_c_count      INT DEFAULT 0,
  option_d_count      INT DEFAULT 0,
  no_response_count   INT DEFAULT 0,
  UNIQUE (assessment_id, item_number)
);
 
 
-- ============================================================
-- 14. COMPETENCY PERFORMANCE
-- Class-level MPS per competency per assessment.
-- ============================================================
CREATE TABLE competency_performance (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id     UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  competency_id     UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  class_mps         NUMERIC(6,2),
  is_least_learned  BOOLEAN DEFAULT FALSE,
  computed_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (assessment_id, competency_id)
);


-- ============================================================
-- SOCORRA — INDEXES, TRIGGERS, RLS & ANALYTICS QUERIES
-- Supabase / PostgreSQL
-- ============================================================


-- ============================================================
-- INDEXES
-- ============================================================

-- profiles
CREATE INDEX idx_profiles_school         ON profiles(school_id);
CREATE INDEX idx_profiles_role           ON profiles(role);

-- classes
CREATE INDEX idx_classes_teacher         ON classes(teacher_id);
CREATE INDEX idx_classes_school          ON classes(school_id);
CREATE INDEX idx_classes_subject         ON classes(subject_id);
CREATE INDEX idx_classes_cross_section   ON classes(teacher_id, subject_id, grade_level);

-- students
CREATE INDEX idx_students_class          ON students(class_id);
CREATE INDEX idx_students_gender         ON students(class_id, gender);

-- assessments
CREATE INDEX idx_assessments_class       ON assessments(class_id);
CREATE INDEX idx_assessments_teacher     ON assessments(teacher_id);
CREATE INDEX idx_assessments_status      ON assessments(status);
CREATE INDEX idx_assessments_ww_scope    ON assessments(class_id, quarter, type, status);

-- competencies
CREATE INDEX idx_competencies_assessment ON competencies(assessment_id);

-- assessment_items
CREATE INDEX idx_items_assessment        ON assessment_items(assessment_id);
CREATE INDEX idx_items_competency        ON assessment_items(competency_id);
CREATE INDEX idx_items_cognitive         ON assessment_items(assessment_id, cognitive_level);

-- answer_sheets
CREATE INDEX idx_sheets_assessment       ON answer_sheets(assessment_id);
CREATE INDEX idx_sheets_student          ON answer_sheets(student_id);
CREATE INDEX idx_sheets_status           ON answer_sheets(status);
CREATE INDEX idx_sheets_unconfirmed      ON answer_sheets(assessment_id) WHERE student_confirmed = FALSE;

-- extracted_responses
CREATE INDEX idx_responses_sheet         ON extracted_responses(answer_sheet_id);
CREATE INDEX idx_responses_assessment    ON extracted_responses(assessment_id);
CREATE INDEX idx_responses_needs_review  ON extracted_responses(answer_sheet_id) WHERE needs_review = TRUE;

-- student_scores
CREATE INDEX idx_scores_assessment       ON student_scores(assessment_id);
CREATE INDEX idx_scores_student          ON student_scores(student_id);
CREATE INDEX idx_scores_answer_sheet     ON student_scores(answer_sheet_id);

-- item_analysis
CREATE INDEX idx_item_analysis_assess    ON item_analysis(assessment_id);
CREATE INDEX idx_item_analysis_item      ON item_analysis(assessment_item_id);

-- competency_performance
CREATE INDEX idx_comp_perf_assessment    ON competency_performance(assessment_id);
CREATE INDEX idx_comp_perf_competency    ON competency_performance(competency_id);
CREATE INDEX idx_comp_perf_llc           ON competency_performance(assessment_id) WHERE is_least_learned = TRUE;


-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_classes
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_assessments
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================
-- TRIGGER: auto-create profile on signup
-- Handles both email/password and Google OAuth
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',   -- Google OAuth sends 'name'
      ''
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools                ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects               ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE students               ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies           ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_sheets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_scores         ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_analysis          ENABLE ROW LEVEL SECURITY;
ALTER TABLE competency_performance ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Schools & Subjects (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view schools"
  ON schools FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view subjects"
  ON subjects FOR SELECT USING (auth.role() = 'authenticated');

-- Classes
CREATE POLICY "Teachers can manage own classes"
  ON classes FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "School heads can view school classes"
  ON classes FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role = 'school_head'
        AND school_id = classes.school_id
    )
  );

-- Students
CREATE POLICY "Teachers can manage own students"
  ON students FOR ALL USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = students.class_id
        AND classes.teacher_id = auth.uid()
    )
  );

-- Assessments
CREATE POLICY "Teachers can manage own assessments"
  ON assessments FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "School heads can view assessments"
  ON assessments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN classes c ON c.school_id = p.school_id
      WHERE p.id = auth.uid()
        AND p.role = 'school_head'
        AND c.id = assessments.class_id
    )
  );

-- Assessment items and competencies: follow assessment ownership
CREATE POLICY "Teachers can manage own assessment items"
  ON assessment_items FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = assessment_items.assessment_id
        AND assessments.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can manage own competencies"
  ON competencies FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = competencies.assessment_id
        AND assessments.teacher_id = auth.uid()
    )
  );

-- Answer sheets, responses, scores: teacher-only via assessment ownership
CREATE POLICY "Teachers can manage answer sheets"
  ON answer_sheets FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = answer_sheets.assessment_id
        AND assessments.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can manage extracted responses"
  ON extracted_responses FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = extracted_responses.assessment_id
        AND assessments.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can manage student scores"
  ON student_scores FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = student_scores.assessment_id
        AND assessments.teacher_id = auth.uid()
    )
  );

-- Analytics: teachers manage; school heads view
CREATE POLICY "Teachers can manage item analysis"
  ON item_analysis FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = item_analysis.assessment_id
        AND assessments.teacher_id = auth.uid()
    )
  );
CREATE POLICY "School heads can view item analysis"
  ON item_analysis FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN assessments a ON TRUE
      JOIN classes c ON c.id = a.class_id AND c.school_id = p.school_id
      WHERE p.id = auth.uid()
        AND p.role = 'school_head'
        AND a.id = item_analysis.assessment_id
    )
  );
CREATE POLICY "Teachers can manage competency performance"
  ON competency_performance FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = competency_performance.assessment_id
        AND assessments.teacher_id = auth.uid()
    )
  );
CREATE POLICY "School heads can view competency performance"
  ON competency_performance FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN assessments a ON TRUE
      JOIN classes c ON c.id = a.class_id AND c.school_id = p.school_id
      WHERE p.id = auth.uid()
        AND p.role = 'school_head'
        AND a.id = competency_performance.assessment_id
    )
  );


-- ============================================================
-- COMPUTATION QUERIES
-- Run these after answer sheets are finalized to populate
-- student_scores, item_analysis, and competency_performance.
-- Replace <assessment_id> with the actual UUID.
-- ============================================================

-- A. Compute and upsert student scores
INSERT INTO student_scores (assessment_id, student_id, answer_sheet_id, raw_score, percentage_score)
SELECT
  ash.assessment_id,
  ash.student_id,
  ash.id AS answer_sheet_id,
  COUNT(*) FILTER (
    WHERE COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
  ) AS raw_score,
  ROUND(
    COUNT(*) FILTER (
      WHERE COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
    ) * 100.0 / NULLIF(a.total_items, 0)
  , 2) AS percentage_score
FROM answer_sheets ash
JOIN extracted_responses er   ON er.answer_sheet_id = ash.id
JOIN assessment_items ai      ON ai.assessment_id   = ash.assessment_id
                             AND ai.item_number     = er.item_number
JOIN assessments a            ON a.id               = ash.assessment_id
WHERE ash.assessment_id = '<assessment_id>'
  AND ash.status        = 'finalized'
  AND ash.student_id    IS NOT NULL
GROUP BY ash.assessment_id, ash.student_id, ash.id, a.total_items
ON CONFLICT (assessment_id, student_id)
DO UPDATE SET
  raw_score        = EXCLUDED.raw_score,
  percentage_score = EXCLUDED.percentage_score,
  is_finalized     = TRUE,
  computed_at      = NOW();


-- B. Compute and upsert item analysis
INSERT INTO item_analysis (
  assessment_id, assessment_item_id, item_number, difficulty_index,
  option_a_count, option_b_count, option_c_count, option_d_count, no_response_count
)
SELECT
  ai.assessment_id,
  ai.id AS assessment_item_id,
  ai.item_number,
  ROUND(
    COUNT(*) FILTER (
      WHERE COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
    ) * 1.0 / NULLIF(COUNT(*), 0)
  , 4) AS difficulty_index,
  COUNT(*) FILTER (WHERE COALESCE(er.override_answer, er.extracted_answer) = 'A') AS option_a_count,
  COUNT(*) FILTER (WHERE COALESCE(er.override_answer, er.extracted_answer) = 'B') AS option_b_count,
  COUNT(*) FILTER (WHERE COALESCE(er.override_answer, er.extracted_answer) = 'C') AS option_c_count,
  COUNT(*) FILTER (WHERE COALESCE(er.override_answer, er.extracted_answer) = 'D') AS option_d_count,
  COUNT(*) FILTER (
    WHERE er.extracted_answer IS NULL AND er.override_answer IS NULL
  ) AS no_response_count
FROM assessment_items ai
JOIN answer_sheets ash        ON ash.assessment_id = ai.assessment_id
                             AND ash.status        = 'finalized'
JOIN extracted_responses er   ON er.answer_sheet_id = ash.id
                             AND er.item_number    = ai.item_number
WHERE ai.assessment_id = '<assessment_id>'
GROUP BY ai.assessment_id, ai.id, ai.item_number
ON CONFLICT (assessment_id, item_number)
DO UPDATE SET
  difficulty_index  = EXCLUDED.difficulty_index,
  option_a_count    = EXCLUDED.option_a_count,
  option_b_count    = EXCLUDED.option_b_count,
  option_c_count    = EXCLUDED.option_c_count,
  option_d_count    = EXCLUDED.option_d_count,
  no_response_count = EXCLUDED.no_response_count;


-- C. Compute and upsert competency performance (MPS + LLC flag)
WITH competency_scores AS (
  SELECT
    ai.competency_id,
    ai.assessment_id,
    ROUND(
      AVG(
        CASE WHEN COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
             THEN 100.0 ELSE 0.0 END
      )::NUMERIC, 2
    ) AS competency_mps
  FROM assessment_items ai
  JOIN answer_sheets ash      ON ash.assessment_id = ai.assessment_id
                             AND ash.status        = 'finalized'
  JOIN extracted_responses er ON er.answer_sheet_id = ash.id
                             AND er.item_number    = ai.item_number
  WHERE ai.assessment_id = '<assessment_id>'
  GROUP BY ai.competency_id, ai.assessment_id
),
threshold AS (
  SELECT AVG(competency_mps) * 0.75 AS llc_threshold
  FROM competency_scores
)
INSERT INTO competency_performance (assessment_id, competency_id, class_mps, is_least_learned)
SELECT
  cs.assessment_id,
  cs.competency_id,
  cs.competency_mps,
  cs.competency_mps < t.llc_threshold
FROM competency_scores cs, threshold t
ON CONFLICT (assessment_id, competency_id)
DO UPDATE SET
  class_mps        = EXCLUDED.class_mps,
  is_least_learned = EXCLUDED.is_least_learned,
  computed_at      = NOW();


-- ============================================================
-- SCOPE 1 — SINGLE ASSESSMENT ANALYTICS
-- ============================================================

-- 1A. Class performance summary (KPI cards)
SELECT
  COUNT(ss.id)                                                   AS total_students,
  a.total_items                                                  AS highest_possible,
  ROUND(AVG(ss.raw_score)::NUMERIC, 2)                          AS avg_raw_score,
  ROUND(AVG(ss.percentage_score)::NUMERIC, 2)                   AS avg_ps,
  MAX(ss.raw_score)                                             AS highest_raw,
  MIN(ss.raw_score)                                             AS lowest_raw,
  ROUND(MAX(ss.percentage_score)::NUMERIC, 2)                   AS highest_ps,
  ROUND(MIN(ss.percentage_score)::NUMERIC, 2)                   AS lowest_ps,
  ROUND(
    COUNT(*) FILTER (WHERE ss.percentage_score >= 75)
    * 100.0 / NULLIF(COUNT(*), 0)::NUMERIC, 2
  )                                                              AS pass_rate_pct
FROM student_scores ss
JOIN assessments a ON a.id = ss.assessment_id
WHERE ss.assessment_id = '<assessment_id>'
  AND ss.is_finalized   = TRUE
GROUP BY a.total_items;


-- 1B. Score distribution by DepEd descriptor bands (donut / stacked bar)
SELECT
  CASE
    WHEN percentage_score >= 90 THEN 'Outstanding'
    WHEN percentage_score >= 85 THEN 'Very Satisfactory'
    WHEN percentage_score >= 80 THEN 'Satisfactory'
    WHEN percentage_score >= 75 THEN 'Fairly Satisfactory'
    ELSE                              'Did Not Meet Expectations'
  END                                    AS descriptor,
  CASE
    WHEN percentage_score >= 90 THEN 1
    WHEN percentage_score >= 85 THEN 2
    WHEN percentage_score >= 80 THEN 3
    WHEN percentage_score >= 75 THEN 4
    ELSE                              5
  END                                    AS sort_order,
  COUNT(*)                               AS student_count,
  ROUND(
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()::NUMERIC, 2
  )                                      AS percentage_of_class
FROM student_scores
WHERE assessment_id = '<assessment_id>'
  AND is_finalized   = TRUE
GROUP BY 1, 2
ORDER BY 2;


-- 1C. Item analysis — ranked most to least missed
--     (horizontal bar + distractor frequency table)
SELECT
  ia.item_number,
  ai.correct_answer,
  ai.cognitive_level,
  ai.difficulty_band,
  c.code                                       AS competency_code,
  c.description                                AS competency_description,
  ROUND(ia.difficulty_index::NUMERIC, 4)       AS difficulty_index,
  CASE
    WHEN ia.difficulty_index < 0.20 THEN 'Very Difficult'
    WHEN ia.difficulty_index < 0.40 THEN 'Difficult'
    WHEN ia.difficulty_index < 0.60 THEN 'Average'
    WHEN ia.difficulty_index < 0.80 THEN 'Easy'
    ELSE                                  'Very Easy'
  END                                          AS difficulty_category,
  ia.option_a_count,
  ia.option_b_count,
  ia.option_c_count,
  ia.option_d_count,
  ia.no_response_count,
  -- Top distractor: most chosen wrong option
  CASE
    WHEN ai.correct_answer != 'A'
      AND ia.option_a_count = GREATEST(
        CASE WHEN ai.correct_answer != 'A' THEN ia.option_a_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'B' THEN ia.option_b_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'C' THEN ia.option_c_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'D' THEN ia.option_d_count ELSE -1 END
      ) THEN 'A'
    WHEN ai.correct_answer != 'B'
      AND ia.option_b_count = GREATEST(
        CASE WHEN ai.correct_answer != 'A' THEN ia.option_a_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'B' THEN ia.option_b_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'C' THEN ia.option_c_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'D' THEN ia.option_d_count ELSE -1 END
      ) THEN 'B'
    WHEN ai.correct_answer != 'C'
      AND ia.option_c_count = GREATEST(
        CASE WHEN ai.correct_answer != 'A' THEN ia.option_a_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'B' THEN ia.option_b_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'C' THEN ia.option_c_count ELSE -1 END,
        CASE WHEN ai.correct_answer != 'D' THEN ia.option_d_count ELSE -1 END
      ) THEN 'C'
    ELSE 'D'
  END                                          AS top_distractor
FROM item_analysis ia
JOIN assessment_items ai ON ai.id          = ia.assessment_item_id
JOIN competencies c      ON c.id           = ai.competency_id
WHERE ia.assessment_id = '<assessment_id>'
ORDER BY ia.difficulty_index ASC;   -- most missed first


-- 1D. Competency performance — ranked bar with 60% remediation threshold
SELECT
  c.code,
  c.description,
  c.no_of_items,
  ROUND(cp.class_mps::NUMERIC, 2)             AS class_mps,
  cp.is_least_learned,
  cp.class_mps < 60                           AS needs_remediation
FROM competency_performance cp
JOIN competencies c ON c.id = cp.competency_id
WHERE cp.assessment_id = '<assessment_id>'
ORDER BY cp.class_mps ASC;


-- 1E. Cognitive level breakdown — radar chart data
SELECT
  ai.cognitive_level,
  COUNT(ai.id)                                AS total_items,
  ROUND(
    AVG(
      CASE WHEN COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
           THEN 100.0 ELSE 0.0 END
    )::NUMERIC, 2
  )                                           AS avg_correct_pct
FROM assessment_items ai
JOIN answer_sheets ash      ON ash.assessment_id = ai.assessment_id
                           AND ash.status        = 'finalized'
JOIN extracted_responses er ON er.answer_sheet_id = ash.id
                           AND er.item_number    = ai.item_number
WHERE ai.assessment_id = '<assessment_id>'
GROUP BY ai.cognitive_level
ORDER BY
  CASE ai.cognitive_level
    WHEN 'remembering'   THEN 1
    WHEN 'understanding' THEN 2
    WHEN 'applying'      THEN 3
    WHEN 'analyzing'     THEN 4
    WHEN 'evaluating'    THEN 5
    WHEN 'creating'      THEN 6
  END;


-- 1F. At-risk students panel — PS < 75 (DNME) with missed competencies
SELECT
  s.full_name,
  s.gender,
  ss.raw_score,
  ROUND(ss.percentage_score::NUMERIC, 2)      AS percentage_score,
  ARRAY_AGG(DISTINCT c.description) FILTER (
    WHERE COALESCE(er.override_answer, er.extracted_answer) != ai.correct_answer
  )                                           AS missed_competencies
FROM student_scores ss
JOIN students s             ON s.id              = ss.student_id
JOIN answer_sheets ash      ON ash.id            = ss.answer_sheet_id
JOIN extracted_responses er ON er.answer_sheet_id = ash.id
JOIN assessment_items ai    ON ai.assessment_id  = ss.assessment_id
                           AND ai.item_number    = er.item_number
JOIN competencies c         ON c.id              = ai.competency_id
WHERE ss.assessment_id    = '<assessment_id>'
  AND ss.percentage_score < 75
  AND ss.is_finalized      = TRUE
GROUP BY s.id, s.full_name, s.gender, ss.raw_score, ss.percentage_score
ORDER BY ss.percentage_score ASC;


-- ============================================================
-- SCOPE 2 — QUARTERLY WW COMPONENT VIEW
-- ============================================================

-- 2A. WW PS & WS tracker — running cumulative line chart
--     ww_weight stored as decimal (e.g. 0.40 for 40%)
SELECT
  a.id                                                          AS assessment_id,
  a.title,
  a.created_at                                                  AS assessment_date,
  a.total_items,
  SUM(a.total_items) OVER (
    PARTITION BY a.class_id ORDER BY a.created_at
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  )                                                             AS cumulative_highest_possible,
  ROUND(
    SUM(agg.class_avg_raw) OVER (
      PARTITION BY a.class_id ORDER BY a.created_at
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )::NUMERIC, 2
  )                                                             AS cumulative_avg_raw,
  ROUND(
    SUM(agg.class_avg_raw) OVER (
      PARTITION BY a.class_id ORDER BY a.created_at
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) * 100.0 / NULLIF(
      SUM(a.total_items) OVER (
        PARTITION BY a.class_id ORDER BY a.created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ), 0)::NUMERIC, 2
  )                                                             AS cumulative_ps,
  ROUND(
    SUM(agg.class_avg_raw) OVER (
      PARTITION BY a.class_id ORDER BY a.created_at
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) * 100.0 / NULLIF(
      SUM(a.total_items) OVER (
        PARTITION BY a.class_id ORDER BY a.created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ), 0) * sub.ww_weight::NUMERIC, 2
  )                                                             AS cumulative_ws
FROM assessments a
JOIN classes cl             ON cl.id  = a.class_id
JOIN subjects sub           ON sub.id = cl.subject_id
JOIN (
  SELECT assessment_id, AVG(raw_score) AS class_avg_raw
  FROM student_scores
  WHERE is_finalized = TRUE
  GROUP BY assessment_id
) agg ON agg.assessment_id = a.id
WHERE a.class_id = '<class_id>'
  AND a.quarter  = '<quarter>'
  AND a.type     = 'formative'
  AND a.status   = 'finalized'
ORDER BY a.created_at;


-- 2B. Student WW standing table — sortable, exportable
SELECT
  s.id                                                          AS student_id,
  s.full_name,
  s.gender,
  SUM(ss.raw_score)                                             AS cumulative_raw,
  SUM(a.total_items)                                            AS cumulative_highest_possible,
  ROUND(
    SUM(ss.raw_score) * 100.0 / NULLIF(SUM(a.total_items), 0)::NUMERIC, 2
  )                                                             AS cumulative_ps,
  ROUND(
    SUM(ss.raw_score) * 100.0
    / NULLIF(SUM(a.total_items), 0)
    * sub.ww_weight::NUMERIC, 2
  )                                                             AS weighted_score,
  SUM(ss.raw_score) * 100.0
    / NULLIF(SUM(a.total_items), 0) < 75                       AS is_at_risk
FROM students s
JOIN student_scores ss      ON ss.student_id    = s.id
JOIN assessments a          ON a.id             = ss.assessment_id
JOIN classes cl             ON cl.id            = a.class_id
JOIN subjects sub           ON sub.id           = cl.subject_id
WHERE cl.id      = '<class_id>'
  AND a.quarter  = '<quarter>'
  AND a.type     = 'formative'
  AND ss.is_finalized = TRUE
GROUP BY s.id, s.full_name, s.gender, sub.ww_weight
ORDER BY cumulative_ps DESC;


-- 2C. Competency coverage map — grid / checklist
SELECT
  c.code,
  c.description,
  COUNT(DISTINCT a.id)                        AS times_assessed,
  ROUND(AVG(cp.class_mps)::NUMERIC, 2)        AS avg_mps,
  BOOL_OR(cp.is_least_learned)               AS ever_flagged_llc
FROM competencies c
JOIN assessment_items ai    ON ai.competency_id  = c.id
JOIN assessments a          ON a.id              = ai.assessment_id
LEFT JOIN competency_performance cp
                            ON cp.competency_id  = c.id
                           AND cp.assessment_id  = a.id
WHERE a.class_id = '<class_id>'
  AND a.quarter  = '<quarter>'
  AND a.type     = 'formative'
  AND a.status   = 'finalized'
GROUP BY c.id, c.code, c.description
ORDER BY times_assessed DESC, avg_mps ASC;


-- ============================================================
-- SCOPE 3 — STUDENT DRILL-DOWN
-- ============================================================

-- 3A. Per-assessment score timeline (bar / line chart)
SELECT
  a.id                                        AS assessment_id,
  a.title,
  a.type,
  a.quarter,
  a.created_at,
  a.total_items,
  ss.raw_score,
  ROUND(ss.percentage_score::NUMERIC, 2)      AS percentage_score,
  CASE
    WHEN ss.percentage_score >= 90 THEN 'Outstanding'
    WHEN ss.percentage_score >= 85 THEN 'Very Satisfactory'
    WHEN ss.percentage_score >= 80 THEN 'Satisfactory'
    WHEN ss.percentage_score >= 75 THEN 'Fairly Satisfactory'
    ELSE                                'Did Not Meet Expectations'
  END                                         AS descriptor
FROM student_scores ss
JOIN assessments a ON a.id = ss.assessment_id
WHERE ss.student_id  = '<student_id>'
  AND a.class_id     = '<class_id>'
  AND a.quarter      = '<quarter>'
  AND ss.is_finalized = TRUE
ORDER BY a.created_at;


-- 3B. Student competency gap profile
SELECT
  c.code,
  c.description,
  COUNT(DISTINCT a.id)                        AS times_assessed,
  ROUND(
    AVG(
      CASE WHEN COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
           THEN 100.0 ELSE 0.0 END
    )::NUMERIC, 2
  )                                           AS student_avg_correct_pct,
  ROUND(AVG(cp.class_mps)::NUMERIC, 2)        AS class_avg_mps,
  AVG(
    CASE WHEN COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
         THEN 100.0 ELSE 0.0 END
  ) < 60                                      AS is_gap
FROM answer_sheets ash
JOIN extracted_responses er ON er.answer_sheet_id = ash.id
JOIN assessment_items ai    ON ai.assessment_id   = ash.assessment_id
                           AND ai.item_number     = er.item_number
JOIN competencies c         ON c.id               = ai.competency_id
JOIN assessments a          ON a.id               = ash.assessment_id
LEFT JOIN competency_performance cp
                            ON cp.assessment_id   = a.id
                           AND cp.competency_id   = c.id
WHERE ash.student_id = '<student_id>'
  AND a.class_id     = '<class_id>'
  AND a.quarter      = '<quarter>'
  AND ash.status     = 'finalized'
GROUP BY c.id, c.code, c.description
ORDER BY student_avg_correct_pct ASC;


-- 3C. Student cognitive level profile (radar chart)
SELECT
  ai.cognitive_level,
  COUNT(ai.id)                                AS total_items_attempted,
  COUNT(*) FILTER (
    WHERE COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
  )                                           AS correct_count,
  ROUND(
    COUNT(*) FILTER (
      WHERE COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
    ) * 100.0 / NULLIF(COUNT(ai.id), 0)::NUMERIC, 2
  )                                           AS correct_pct
FROM answer_sheets ash
JOIN extracted_responses er ON er.answer_sheet_id = ash.id
JOIN assessment_items ai    ON ai.assessment_id   = ash.assessment_id
                           AND ai.item_number     = er.item_number
JOIN assessments a          ON a.id               = ash.assessment_id
WHERE ash.student_id = '<student_id>'
  AND a.class_id     = '<class_id>'
  AND a.quarter      = '<quarter>'
  AND ash.status     = 'finalized'
GROUP BY ai.cognitive_level
ORDER BY
  CASE ai.cognitive_level
    WHEN 'remembering'   THEN 1
    WHEN 'understanding' THEN 2
    WHEN 'applying'      THEN 3
    WHEN 'analyzing'     THEN 4
    WHEN 'evaluating'    THEN 5
    WHEN 'creating'      THEN 6
  END;


-- ============================================================
-- SCOPE 4 — CROSS-SECTION COMPARISON
-- Only surfaced when teacher has 2+ sections of same subject
-- and grade level. Replace filter values accordingly.
-- ============================================================

-- 4A. Side-by-side class averages and descriptor distribution
--     (grouped bar chart — one bar per section per descriptor)
SELECT
  cl.section_name,
  COUNT(ss.student_id)                                                AS student_count,
  ROUND(AVG(ss.raw_score)::NUMERIC, 2)                               AS avg_raw,
  ROUND(AVG(ss.percentage_score)::NUMERIC, 2)                        AS avg_ps,
  COUNT(*) FILTER (WHERE ss.percentage_score >= 90)                  AS outstanding,
  COUNT(*) FILTER (WHERE ss.percentage_score >= 85
                     AND ss.percentage_score <  90)                  AS very_satisfactory,
  COUNT(*) FILTER (WHERE ss.percentage_score >= 80
                     AND ss.percentage_score <  85)                  AS satisfactory,
  COUNT(*) FILTER (WHERE ss.percentage_score >= 75
                     AND ss.percentage_score <  80)                  AS fairly_satisfactory,
  COUNT(*) FILTER (WHERE ss.percentage_score <  75)                  AS dnme,
  ROUND(
    COUNT(*) FILTER (WHERE ss.percentage_score >= 75)
    * 100.0 / NULLIF(COUNT(*), 0)::NUMERIC, 2
  )                                                                   AS pass_rate_pct
FROM student_scores ss
JOIN assessments a  ON a.id  = ss.assessment_id
JOIN classes cl     ON cl.id = a.class_id
WHERE cl.teacher_id  = '<teacher_id>'
  AND cl.subject_id  = '<subject_id>'
  AND cl.grade_level = '<grade_level>'
  AND a.quarter      = '<quarter>'
  AND ss.is_finalized = TRUE
GROUP BY cl.id, cl.section_name
ORDER BY avg_ps DESC;


-- 4B. Cross-section competency comparison
SELECT
  cl.section_name,
  c.code,
  c.description,
  ROUND(AVG(cp.class_mps)::NUMERIC, 2)        AS section_mps,
  BOOL_OR(cp.is_least_learned)               AS flagged_llc
FROM competency_performance cp
JOIN competencies c  ON c.id  = cp.competency_id
JOIN assessments a   ON a.id  = cp.assessment_id
JOIN classes cl      ON cl.id = a.class_id
WHERE cl.teacher_id  = '<teacher_id>'
  AND cl.subject_id  = '<subject_id>'
  AND cl.grade_level = '<grade_level>'
  AND a.quarter      = '<quarter>'
  AND a.status       = 'finalized'
GROUP BY cl.id, cl.section_name, c.id, c.code, c.description
ORDER BY cl.section_name, section_mps ASC;


-- 4C. Cross-section cognitive level comparison (radar chart per section)
SELECT
  cl.section_name,
  ai.cognitive_level,
  ROUND(
    AVG(
      CASE WHEN COALESCE(er.override_answer, er.extracted_answer) = ai.correct_answer
           THEN 100.0 ELSE 0.0 END
    )::NUMERIC, 2
  )                                           AS avg_correct_pct
FROM assessment_items ai
JOIN answer_sheets ash      ON ash.assessment_id = ai.assessment_id
                           AND ash.status        = 'finalized'
JOIN extracted_responses er ON er.answer_sheet_id = ash.id
                           AND er.item_number    = ai.item_number
JOIN assessments a          ON a.id              = ash.assessment_id
JOIN classes cl             ON cl.id             = a.class_id
WHERE cl.teacher_id  = '<teacher_id>'
  AND cl.subject_id  = '<subject_id>'
  AND cl.grade_level = '<grade_level>'
  AND a.quarter      = '<quarter>'
  AND a.status       = 'finalized'
GROUP BY cl.id, cl.section_name, ai.cognitive_level
ORDER BY cl.section_name,
  CASE ai.cognitive_level
    WHEN 'remembering'   THEN 1
    WHEN 'understanding' THEN 2
    WHEN 'applying'      THEN 3
    WHEN 'analyzing'     THEN 4
    WHEN 'evaluating'    THEN 5
    WHEN 'creating'      THEN 6
  END;