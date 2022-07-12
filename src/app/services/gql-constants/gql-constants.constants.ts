export const GqlConstants = {
  CREATE_SESSION: `mutation StartSession($careplan: uuid) {
    insert_session_one(object: {careplan: $careplan}) {
      id
      createdAt
      updatedAt
      careplan
    }
  }`,
  GET_ACTIVE_PLANS: `query GetCareplan {
    careplan {
      id
      name
      difficultyLevel
      estimatedDuration
    }
  }`,
  GET_CAREPLAN_DETAILS: `query GetCareplanActivities {
    careplan_activity {
      activityByActivity {
        id
        name
      }
    }
  }`,
  GET_SESSIONS: `query GetSessions($offset: Int, $limit: Int, $patientId: uuid) {
      session_aggregate(where: {patient: {_eq: $patientId}, status: {_neq: trashed}}) {
        aggregate {
          count
        }
      }
      session(order_by: {createdAt: desc}, limit: $limit, offset: $offset, where: {patient: {_eq: $patientId}, status: {_neq: trashed}}) {
        id
        createdAt
        endedAt
        careplanByCareplan {
          name
        }
        patientByPatient {
          identifier
          medicalConditions
        }
      }
    }
  `,
  GET_MONTHLY_GOALS: `
  query PatientMonthlyGoal($startDate: String!, $endDate: String!, $userTimezone: String!) {
    patientMonthlyGoals(endDate: $endDate, startDate: $startDate, userTimezone: $userTimezone) {
      status
      data {
        daysCompleted
        rewardsCountDown
      }
    }
  }
  `,
  GET_DAILY_GOALS: `
  query PatientDailyGoals($activityIds: [String!]!, $date: String!) {
    patientDailyGoals(activityIds: $activityIds, date: $date) {
      status
      data {
        activities {
          id
          isCompleted
        }
      }
    }
  }
  `,
  GET_PATIENT_REWARDS: `
  query GetPatientRewards {
    patient {
      rewards
    }
  }
  `,
  MARK_REWARD_AS_VIEWED: `
  mutation MarkRewardAsViewed($rewardTier: String!) {
    markRewardAsViewed(rewardTier: $rewardTier) {
      status
    }
  }
  `,
  GET_STREAK: `
  query GetStreak {
    patientSessionStreak {
      streak
    }
  }
  `,
  USER_MOOD_CHECKIN: `mutation InsertUserMoodCheckin($mood: mood_enum!) {
    insert_checkin_one(object: {mood: $mood}) {
      mood
    }
  }
  `,
  GET_USER_LAST_CHECKIN: `query GetUserLastCheckin {
    checkin(limit: 1, order_by: {created_at: desc}) {
      created_at
    }
  }
  `,
  USER_FEEDBACK: `mutation InsertFeedback($description: String, $rating: Int!) {
    insert_patient_feedback(objects: {description: $description, rating: $rating}) {
      returning {
        id
      }
    }
  }`,
  SET_RECOMMENDATION_SCORE: `mutation SetRecommendationScore($feedbackId: uuid!, $recommendationScore: Int!) {
    update_patient_feedback_by_pk(pk_columns: {id: $feedbackId}, _set: {recommendationScore: $recommendationScore}) {
      id
    }
  }`,
  SIGN_UP_PATIENT: `
  mutation SignUpPatient($code: String = "", $email: String = "", $nickname: String = "", $password: String = "") {
    signUpPatient(code: $code, email: $email, nickname: $nickname, password: $password) {
      token
      patient {
        id
        nickname
        provider
        activeCareplan
      }
    }
  }
  `,

  SET_NICKNAME: `
  mutation UpdateNickName($id: uuid!, $nickname: String) {
    update_patient_by_pk(pk_columns: {id: $id}, _set: {nickname: $nickname}) {
      nickname
    }
  }`,

  SET_FAV_GENRE: `
  mutation SetFavGenre($id: uuid!, $genres: jsonb) {
    update_patient_by_pk(pk_columns: {id: $id}, _set: {preferredGenres: $genres}) {
      id
    }
  }
  `,
  SET_FAV_ACTIVITIES: `
  mutation SetFavActivities($id: uuid!, $activities: jsonb) {
    update_patient_by_pk(pk_columns: {id: $id}, _set: {preferredActivities: $activities}) {
      id
    }
  }
  `,
  
  EXCHANGE_CODE: `mutation ExchangeCode($code: String!) {
    exchangeCodeWithTokens(code: $code) {
      status
      data {
        access_token
        expires_in
        id_token
        refresh_token
        token_type
      }
    }
  }`,

  REFRESH_TOKEN: `mutation RefreshTokens($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      status
      data {
        AccessToken
        ExpiresIn
        IdToken
        TokenType
      }
    }
  }`,
  REVOKE_REFRESH_TOKEN: `mutation RevokeRefreshToken($refreshToken: String!) {
    revokeRefreshToken(refreshToken: $refreshToken) {
      status
    }
  }`,

  GET_PATIENT_DETAILS: `query PatientDetails($user:uuid!) {
    patient_by_pk(id:$user) {
      id
      email
      preferredGenres
      nickname
    }
  }`
};
