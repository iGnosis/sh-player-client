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
  GET_CAREPLAN_DETAILS: `query GetCarePlanDetails($careplan: uuid = "40f81454-c97d-42bc-b20f-829cc3d2728e") {
  careplan(where: {id: {_eq: $careplan}}) {
    name
    id
    careplan_activities {
      activityByActivity {
        name
        duration
        id
      }
      reps
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
  query MonthlyGoals($month: Int = 0, $year: Int = 0) {
    patientMonthlyGoals(month: $month, year: $year) {
      data {
        date
        totalSessionDurationInMin
      }
    }
  }
  `,
  GET_DAILY_GOALS: `
  query DailyGoals($date: String = "") {
    patientDailyGoals(date: $date) {
      dailyMinutesCompleted
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
