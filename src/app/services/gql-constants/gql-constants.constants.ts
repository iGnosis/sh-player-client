export const GqlConstants = {
  CREATE_SESSION: `mutation StartSession($careplan: uuid!) {
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
};
