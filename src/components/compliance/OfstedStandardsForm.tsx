import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StandardSection {
  title: string;
  requirements: string[];
  actions: string[];
}

const ofstedStandards: Record<string, StandardSection> = {
  "Safeguarding and Child Protection": {
    title: "Safeguarding and Child Protection",
    requirements: [
      "Designated safeguarding lead appointed",
      "Staff trained in safeguarding procedures",
      "Clear reporting procedures in place",
      "Regular safeguarding reviews",
      "Up-to-date safeguarding policy",
      "Safe recruitment procedures",
      "Risk assessments completed"
    ],
    actions: [
      "Review and update safeguarding policies",
      "Conduct regular staff training",
      "Maintain accurate records of concerns",
      "Engage with local safeguarding partners",
      "Regular safeguarding audits"
    ]
  },
  "Staff Development and Training": {
    title: "Staff Development and Training",
    requirements: [
      "Induction program for new staff",
      "Ongoing professional development",
      "Regular supervision sessions",
      "Training needs assessment",
      "Qualification requirements met",
      "Performance review system"
    ],
    actions: [
      "Implement comprehensive induction program",
      "Schedule regular supervision meetings",
      "Document all training activities",
      "Review training effectiveness",
      "Maintain training records"
    ]
  },
  "Care Planning and Placement": {
    title: "Care Planning and Placement",
    requirements: [
      "Individual care plans in place",
      "Regular care plan reviews",
      "Child-centered approach",
      "Risk assessments completed",
      "Placement matching process",
      "Contact arrangements documented"
    ],
    actions: [
      "Regular care plan updates",
      "Involve children in planning",
      "Document placement decisions",
      "Review placement outcomes",
      "Monitor contact arrangements"
    ]
  },
  "Health and Wellbeing": {
    title: "Health and Wellbeing",
    requirements: [
      "Health assessments completed",
      "Medical records maintained",
      "Mental health support available",
      "Healthy lifestyle promotion",
      "Medication management procedures",
      "First aid arrangements"
    ],
    actions: [
      "Schedule health assessments",
      "Review medication procedures",
      "Promote healthy activities",
      "Monitor health outcomes",
      "Update medical records"
    ]
  },
  "Education and Achievement": {
    title: "Education and Achievement",
    requirements: [
      "Education arrangements in place",
      "Progress monitoring system",
      "Support for additional needs",
      "Attendance monitoring",
      "Educational resources available"
    ],
    actions: [
      "Monitor educational progress",
      "Liaise with schools",
      "Support homework completion",
      "Review educational outcomes",
      "Provide learning resources"
    ]
  },
  "Positive Behavior Support": {
    title: "Positive Behavior Support",
    requirements: [
      "Behavior management policy",
      "De-escalation procedures",
      "Incident recording system",
      "Staff training in behavior management",
      "Positive reinforcement strategies"
    ],
    actions: [
      "Review behavior policies",
      "Train staff in de-escalation",
      "Monitor behavior incidents",
      "Evaluate intervention effectiveness",
      "Update behavior plans"
    ]
  },
  "Missing from Care": {
    title: "Missing from Care",
    requirements: [
      "Missing person procedures",
      "Risk assessment protocols",
      "Police liaison arrangements",
      "Return interview process",
      "Prevention strategies"
    ],
    actions: [
      "Update missing procedures",
      "Train staff on protocols",
      "Conduct return interviews",
      "Review prevention measures",
      "Maintain incident records"
    ]
  },
  "Leadership and Management": {
    title: "Leadership and Management",
    requirements: [
      "Clear management structure",
      "Quality assurance system",
      "Performance monitoring",
      "Resource management",
      "Staff supervision framework"
    ],
    actions: [
      "Regular management reviews",
      "Monitor service quality",
      "Allocate resources effectively",
      "Supervise staff performance",
      "Maintain management records"
    ]
  },
  "Environment and Safety": {
    title: "Environment and Safety",
    requirements: [
      "Safe and suitable premises",
      "Health and safety checks",
      "Fire safety measures",
      "Security arrangements",
      "Maintenance procedures"
    ],
    actions: [
      "Regular safety checks",
      "Maintain premises",
      "Update risk assessments",
      "Review security measures",
      "Document safety procedures"
    ]
  },
  "Records and Documentation": {
    title: "Records and Documentation",
    requirements: [
      "Case recording standards",
      "Information security",
      "Data protection compliance",
      "Record retention policy",
      "Access to records procedure"
    ],
    actions: [
      "Audit record keeping",
      "Train staff on documentation",
      "Review data protection",
      "Update record systems",
      "Maintain confidentiality"
    ]
  }
};

interface Props {
  onSubmit: (data: any) => void;
}

const OfstedStandardsForm: React.FC<Props> = ({ onSubmit }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<Record<string, string[]>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleRequirement = (section: string, requirement: string) => {
    setSelectedRequirements(prev => {
      const current = prev[section] || [];
      return {
        ...prev,
        [section]: current.includes(requirement)
          ? current.filter(r => r !== requirement)
          : [...current, requirement]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedRequirements);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {Object.entries(ofstedStandards).map(([key, section]) => (
          <div key={key} className="border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              {expandedSections.includes(key) ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedSections.includes(key) && (
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Requirements</h4>
                  <div className="space-y-2">
                    {section.requirements.map((requirement, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedRequirements[key]?.includes(requirement) || false}
                          onChange={() => toggleRequirement(key, requirement)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{requirement}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {section.actions.map((action, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Save Selected Requirements
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfstedStandardsForm;