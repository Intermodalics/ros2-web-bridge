/**
 * Enum for HistoryPolicy
 * @readonly
 * @enum {number}
 */
let HistoryPolicy = {
    /** @member {number} */
    RMW_QOS_POLICY_HISTORY_SYSTEM_DEFAULT: 0,
    /** @member {number} */
    RMW_QOS_POLICY_HISTORY_KEEP_LAST: 1,
    /** @member {number} */
    RMW_QOS_POLICY_HISTORY_KEEP_ALL: 2
  };
  
  /**
   * Enum for ReliabilityPolicy
   * @readonly
   * @enum {number}
   */
  let ReliabilityPolicy = {
    /** @member {number} */
    RMW_QOS_POLICY_RELIABILITY_SYSTEM_DEFAULT: 0,
    /** @member {number} */
    RMW_QOS_POLICY_RELIABILITY_RELIABLE: 1,
    /** @member {number} */
    RMW_QOS_POLICY_RELIABILITY_BEST_EFFORT: 2
  };
  
  /**
   * Enum for DurabilityPolicy
   * @readonly
   * @enum {number}
   */
  let DurabilityPolicy = {
    /** @member {number} */
    RMW_QOS_POLICY_DURABILITY_SYSTEM_DEFAULT: 0,
    /** @member {number} */
    RMW_QOS_POLICY_DURABILITY_TRANSIENT_LOCAL: 1,
    /** @member {number} */
    RMW_QOS_POLICY_DURABILITY_VOLATILE: 2
  };
  
  module.exports.config = {
    "/heartbeat": {
      qos: {
        history: HistoryPolicy.RMW_QOS_POLICY_HISTORY_KEEP_ALL,
        durability: DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_TRANSIENT_LOCAL
      }
    }
  };
