export const GqlConstants = {
  CREATE_SESSION: `mutation StartSession($careplan: uuid) {
    insert_session_one(object: {careplan: $careplan}) {
      id
      createdAt
      updatedAt
      careplan
    }
  }`,
  GET_AVAILABLE_GAMES: `query GetAvailableGames {
    game_name {
      name
    }
  }`,
  GET_GAMES_DATA: `query GetGamesData($startDate: timestamptz = "", $endDate: timestamptz = "") {
    game(where: {createdAt: {_gte: $startDate, _lte: $endDate}, endedAt: {_is_null: false}}, order_by: {createdAt: asc}) {
      id
      game
      createdAt
      endedAt
      updatedAt
      repsCompleted
      totalDuration
      analytics
    }
  }
  `,
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
  MARK_REWARD_AS_ACCESSED: `
  mutation MarkRewardAsAccessed($rewardTier: String!) {
    markRewardAsAccessed(rewardTier: $rewardTier) {
      status
    }
  }`,
  GET_STREAK: `
  query GetStreak {
    patientSessionStreak {
      streak
    }
  }
  `,
  USER_DAILY_CHECKIN: `mutation InsertCheckin($type: checkin_type_enum!, $value: String!) {
    insert_checkin_one(object: {type: $type, value: $value}) {
      id
    }
  }
  `,
  GET_LAST_CHECKIN: `query GetLastCheckin {
    checkin(limit: 1, order_by: {createdAt: desc}) {
      createdAt
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
  SET_PATIENT_DETAILS: `
  mutation UpdateDetails($id: uuid!, $email: String, $nickname: String) {
    update_patient_by_pk(pk_columns: {id: $id}, _set: {email: $email, nickname: $nickname}) {
      email
      nickname
    }
  }`,
  SET_PATIENT_PROFILE: `
  mutation UpdatePatientProfile($id: uuid!, $firstName: String!, $lastName: String!, $namePrefix: String!) {
    update_patient_by_pk(pk_columns: {id: $id}, _set: {firstName: $firstName, lastName: $lastName, namePrefix: $namePrefix}) {
      id
    }
  }`,
  SET_PATIENT_EMAIL: `
  mutation UpdatePatientEmail($id: uuid!, $email: String) {
    update_patient_by_pk(pk_columns: {id: $id}, _set: {email: $email}) {
      email
    }
  }`,
  CREATE_CUSTOMER: `
  mutation CreateCustomer {
    createCustomer {
      customerId
    }
  }`,
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
  GET_PATIENT_DETAILS: `
  query PatientDetails($user:uuid!) {
    patient_by_pk(id:$user) {
      id
      email
      preferredGenres
      nickname
      phoneCountryCode
      phoneNumber
      lastName
      firstName
      customerId
      createdAt
    }
  }`,
  SOUNDHEALTH_FAQ_ACCESSED: `mutation SoundhealthFaqAccessed {
    faqAccessed {
      status
    }
  }`,
  FREE_PARKINSON_RESOURCES_ACCESSED: `mutation FreeParkinsonResourcesAccessed {
    freeParkinsonResourcesAccessed {
      status
    }
  }`,
  FREE_REWARD_ACCESSED: `mutation FreeRewardAccessed {
    freeRewardAccessed {
      status
    }
  }`,
  UPDATE_TIMEZONE: `mutation UpdateTimezone($id: uuid!, $timezone: String) {
    update_patient_by_pk(_set: {timezone: $timezone}, pk_columns: { id: $id }) {
      id
    }
  }`,
  APP_ACCESSED: `mutation AppAccessed {
    appAccessed {
      status
    }
  }`,
  REQUEST_LOGIN_OTP: `mutation RequestLoginOtp($phoneCountryCode: String!, $phoneNumber: String!, $inviteCode: String = "") {
    requestLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber, inviteCode: $inviteCode) {
      data {
        message
        isExistingUser
      }
    }
  }`,
  RESEND_LOGIN_OTP: `mutation ResendLoginOtp($phoneCountryCode: String!, $phoneNumber: String!) {
    resendLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber) {
      data {
        message
        isExistingUser
      }
    }
  }`,
  VERIFY_LOGIN_OTP: `mutation VerifyLoginOtp($phoneCountryCode: String!, $phoneNumber: String!, $otp: Int!) {
    verifyLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber, otp: $otp) {
      data {
        token
      }
    }
  }`,
  FETCH_COUNTRY: `query GetCountryCallingCode($code: ID!) {
    country(code: $code) {
      phone
      name
      emoji
    }
  }`,
  GET_ORGANIZATION_CONFIG: `
    query OrganizationConfig($name: String = "") {
      organization(where: {name: {_eq: $name}}) {
        configuration
        logoUrl
      }
    }
  `,
  GET_PAYMENT_CLIENT_SECRET: `
    mutation CreatePaymentSetupIntent  {
      createPaymentSetupIntent {
        clientSecret
      }
    }`,
  SET_DEFAULT_PAYMENT_METHOD: `
    mutation SetDefaultPaymentMethod($paymentMethodId: String!) {
      setDefaultPaymentMethod(paymentMethodId: $paymentMethodId) {
        data
      }
    }`,
  CREATE_SUBSCRIPTION: `
    mutation CreateSubscription {
      createSubscription {
        subscription
      }
    }
    `,
  GET_DEFAULT_PAYMENT_METHOD: `
    query GetDefaultPaymentMethod {
      getDefaultPaymentMethod {
        data
      }
    }`,
  GET_SUBSCRIPTION_STATUS: `
    query GetSubscriptionStatus {
      getSubscriptionStatus {
        data
      }
    }`,
  GET_SUBSCRIPTION_DETAILS: `
    query GetSubscriptionDetails {
      getSubscriptionDetails {
        subscription
      }
    }`,
  CANCEL_SUBSCRIPTION: `
    mutation CancelSubscription {
      cancelSubscription {
        subscription
      }
    }`,
  GET_BILLING_HISTORY: `
  mutation GetBillingHistory($startingAfter: String = "", $limit: Int = 10, $endingBefore: String = "") {
    getBillingHistory(limit: $limit, startingAfter: $startingAfter, endingBefore: $endingBefore) {
      hasMore
      invoices {
        amountPaid
        cardDetails {
          brand
          last4
        }
        paymentDate
        subscriptionPeriod {
          end
          start
        }
        url
      }
    }
  }`,
  GET_PAYMENT_METHOD_REQUIREMENT: `
  query GetRequirePaymentDetails {
    subscription_plans {
      requirePaymentDetails
    }
  }`,
  GET_TRIAL_PERIOD: `
  query GetRequirePaymentDetails {
    subscription_plans {
      trialPeriod
    }
  }`,
  GET_SUBSCRIPTION_PLAN_DETAILS: `
  query GetSubscriptionPlanDetails {
    subscription_plans {
      subscriptionFee
      trialPeriod
      requirePaymentDetails
    }
  }`,
};
