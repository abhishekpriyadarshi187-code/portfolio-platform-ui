export const SKILL_CATEGORY_DEFINITIONS = [
  {
    label: "Programming Languages",
    patterns: [
      /\bpython\b/,
      /\bjava\b/,
      /\bruby\b/,
      /\bjavascript\b/,
      /\btypescript\b/,
      /\bgo\b/,
      /\bgolang\b/,
      /\bc\+\+\b/,
      /\bc#\b/,
      /\bc language\b/,
      /\bkotlin\b/,
      /\bswift\b/,
      /\bphp\b/,
      /\bscala\b/,
      /\brust\b/,
    ],
  },
  {
    label: "Backend",
    patterns: [
      /spring/,
      /hibernate/,
      /\bjpa\b/,
      /\borm\b/,
      /rest/,
      /graphql/,
      /microservices?/,
      /node\.?js/,
      /express/,
      /django/,
      /flask/,
      /fastapi/,
      /rails/,
      /laravel/,
      /backend/,
      /\bapi\b/,
    ],
  },
  {
    label: "Architecture",
    patterns: [/hld/, /lld/, /design pattern/, /system design/, /architecture/, /event driven/],
  },
  {
    label: "Messaging & Event Streaming",
    patterns: [
      /kafka/,
      /rabbitmq/,
      /active ?mq/,
      /apache pulsar/,
      /\bpulsar\b/,
      /\bnats\b/,
      /\bsqs\b/,
      /\bsns\b/,
      /pub\/?sub/,
      /azure service bus/,
      /kinesis/,
      /eventbridge/,
      /amazon mq/,
      /ibm mq/,
      /rocketmq/,
      /zeromq/,
      /\bjms\b/,
    ],
  },
  {
    label: "Database",
    patterns: [
      /mongodb/,
      /\bmongo\b/,
      /mysql/,
      /sybase/,
      /postgres/,
      /postgresql/,
      /\bsql\b/,
      /oracle/,
      /redis/,
      /dynamodb/,
      /cassandra/,
      /elasticsearch/,
      /database/,
    ],
  },
  {
    label: "Testing",
    patterns: [/junit/, /mockito/, /testng/, /pytest/, /rspec/, /jest/, /cypress/, /testing/],
  },
  {
    label: "Observability",
    patterns: [
      /grafana/,
      /prometheus/,
      /opentelemetry/,
      /open telemetry/,
      /\botel\b/,
      /jaeger/,
      /zipkin/,
      /datadog/,
      /new relic/,
      /splunk/,
      /dynatrace/,
      /appdynamics/,
      /kibana/,
      /logstash/,
      /\bloki\b/,
      /\btempo\b/,
      /alertmanager/,
      /cloudwatch/,
      /azure monitor/,
      /gcp monitoring/,
      /google cloud monitoring/,
      /stackdriver/,
      /sentry/,
      /elastic stack/,
      /\belk\b/,
      /micrometer/,
      /fluentd/,
      /fluent bit/,
      /observability/,
      /monitoring/,
      /distributed tracing/,
    ],
  },
  {
    label: "Cloud & DevOps",
    patterns: [
      /\baws\b/,
      /\bazure\b/,
      /\bgcp\b/,
      /docker/,
      /kubernetes/,
      /jenkins/,
      /terraform/,
      /devops/,
      /ci\/cd/,
      /ansible/,
    ],
  },
  {
    label: "Frontend",
    patterns: [/react/, /javascript/, /typescript/, /\bhtml\b/, /\bcss\b/, /angular/, /vue/, /next\.?js/],
  },
  {
    label: "AI Development",
    patterns: [/claude/, /cline/, /copilot/, /openai/, /\bllm\b/, /prompt/, /langchain/, /rag/],
  },
  {
    label: "Version Control",
    patterns: [/\bgit\b/, /\bsvn\b/, /github/, /gitlab/, /bitbucket/],
  },
];

function getSkillName(skill) {
  if (typeof skill === "string") {
    return skill.trim();
  }

  return skill?.name?.trim() || "";
}

export function categorizeSkills(skills = [], options = {}) {
  const {
    definitions = SKILL_CATEGORY_DEFINITIONS,
    fallbackLabel = "Other",
    preserveSkillObjects = false,
  } = options;

  const grouped = definitions.map((definition) => ({
    label: definition.label,
    items: [],
  }));
  const uncategorized = [];

  skills.forEach((skill) => {
    const name = getSkillName(skill);
    if (!name) return;

    const normalized = name.toLowerCase();
    const targetDefinition = definitions.find((definition) =>
      definition.patterns.some((pattern) => pattern.test(normalized))
    );
    const value = preserveSkillObjects ? skill : name;

    if (targetDefinition) {
      const group = grouped.find((entry) => entry.label === targetDefinition.label);
      if (group && !group.items.some((item) => getSkillName(item) === name)) {
        group.items.push(value);
      }
      return;
    }

    if (!uncategorized.some((item) => getSkillName(item) === name)) {
      uncategorized.push(value);
    }
  });

  const orderedGroups = grouped.filter((group) => group.items.length > 0);

  if (uncategorized.length > 0) {
    orderedGroups.push({
      label: fallbackLabel,
      items: uncategorized,
    });
  }

  return orderedGroups;
}

export function categorizeSkillsAsObject(skills = [], options = {}) {
  const groups = categorizeSkills(skills, {
    ...options,
    preserveSkillObjects: true,
  });

  return Object.fromEntries(groups.map((group) => [group.label, group.items]));
}
