import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, FileText, Download, AlertCircle } from "lucide-react";

const neetUGDocuments = [
  "NEET UG Admit Card",
  "NEET UG Result",
  "NEET Application Form",
  "10th Marksheet",
  "11th Marksheet", 
  "12th Marksheet",
  "Transfer Certificate / Migration",
  "Category Certificate (EWS, OBC, SC, ST) if Applicable",
  "Sub Category Certificate (Defence, Freedom fighter, NRI, Certificate or Any Other)",
  "Photograph (2 Passport size)",
  "Signature",
  "Left hand thumb Impression",
  "Aadhar Card",
  "Voter ID or Driving licence (if Available)",
  "Pan Card (if Available)",
  "Mark of Identification",
  "Graduation Marksheet (if Completed)"
];

const neetPGDocuments = [
  "NEET PG admit card and scorecard",
  "MBBS degree/provisional certificate",
  "All MBBS marksheets",
  "Internship completion certificate",
  "Permanent medical registration certificate",
  "Transfer Certificate / Migration",
  "Category Certificate (EWS, OBC, SC, ST) if Applicable",
  "Sub Category Certificate (Defence, Freedom fighter, NRI, Certificate or Any Other)",
  "Photograph (2 Passport size)",
  "Signature",
  "Left hand thumb Impression",
  "Aadhar Card",
  "Voter ID or Driving licence (if Available)",
  "Pan Card (if Available)",
  "Mark of Identification"
];

interface DocumentChecklistProps {
  documents: string[];
  title: string;
  examType: string;
}

function DocumentList({ documents, title, examType }: DocumentChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const progress = (checkedItems.size / documents.length) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-brand-navy mb-2">{title}</h3>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-brand-green">
            {checkedItems.size}/{documents.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {documents.map((document, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 ${
              checkedItems.has(index) 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200'
            }`}
            onClick={() => toggleCheck(index)}
          >
            {checkedItems.has(index) ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className={`text-sm ${
              checkedItems.has(index) ? 'text-green-800 line-through' : 'text-gray-700'
            }`}>
              {document}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Keep all documents in original + photocopy format</li>
              <li>Ensure all certificates are attested by appropriate authorities</li>
              <li>Documents marked "if applicable" are required only for eligible candidates</li>
              <li>Check specific state requirements for additional documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentChecklist() {
  const downloadChecklist = () => {
    const content = `NEET Document Checklist - AAS Eduguide

NEET UG Documents Required:
${neetUGDocuments.map((doc, i) => `${i + 1}. ${doc}`).join('\n')}

NEET PG Documents Required:
${neetPGDocuments.map((doc, i) => `${i + 1}. ${doc}`).join('\n')}

Important Notes:
• Keep all documents in original + photocopy format
• Ensure all certificates are attested by appropriate authorities
• Documents marked "if applicable" are required only for eligible candidates
• Check specific state requirements for additional documents

For assistance, contact AAS Eduguide:
Email: alladmission1@gmail.com
Phone: +91-8565001261`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NEET-Document-Checklist-AAS-Eduguide.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="documents" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-6">
            Document <span className="text-brand-green">Checklist</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Complete document checklist for NEET UG and PG registration. 
            Check off items as you prepare them to ensure nothing is missed.
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8">
          <Tabs defaultValue="neet-ug" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="neet-ug" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>NEET UG</span>
              </TabsTrigger>
              <TabsTrigger value="neet-pg" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>NEET PG</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="neet-ug">
              <DocumentList 
                documents={neetUGDocuments}
                title="NEET UG Registration 2025"
                examType="UG"
              />
            </TabsContent>

            <TabsContent value="neet-pg">
              <DocumentList 
                documents={neetPGDocuments}
                title="NEET PG Registration 2025"
                examType="PG"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <Button 
                onClick={downloadChecklist}
                className="btn-primary text-white px-8 py-3 text-lg font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Complete Checklist
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Need help with document preparation? Contact our counselors for guidance.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}