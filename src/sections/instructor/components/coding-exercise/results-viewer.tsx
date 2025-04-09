import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ExecuteTestCaseResponse } from '@/types/execute'
import { CheckCircle, FileText, SquareTerminal, XCircle } from 'lucide-react'

interface Props {
  activeTab: 'code-execution' | 'test-results'
  setActiveTab: (tab: 'code-execution' | 'test-results') => void
  executeResult: string
  testResults: ExecuteTestCaseResponse['data']['testCase']
}

export const ResultsViewer = ({
  activeTab,
  setActiveTab,
  executeResult,
  testResults,
}: Props) => {
  return (
    <>
      <ScrollArea className="h-full w-52 border-r px-4 py-2">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('code-execution')}
            className={cn(
              'w-full justify-start',
              activeTab === 'code-execution' &&
                'bg-white/70 text-accent-foreground'
            )}
          >
            <SquareTerminal />
            Console
          </Button>

          <Button
            variant="ghost"
            onClick={() => setActiveTab('test-results')}
            className={cn(
              'w-full justify-start',
              activeTab === 'test-results' &&
                'bg-white/70 text-accent-foreground'
            )}
          >
            <FileText />
            Kết quả test
          </Button>
        </div>
      </ScrollArea>

      <ScrollArea className="h-full flex-1 px-4 py-2">
        {activeTab === 'test-results' && (
          <div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-500 hover:bg-gray-500/30">
                  <TableHead className="w-[100px]">Trạng thái</TableHead>
                  <TableHead>Đầu vào</TableHead>
                  <TableHead>Kỳ vọng</TableHead>
                  <TableHead>Kết quả</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((test, index) => (
                  <TableRow
                    key={index}
                    className="border-gray-500 hover:bg-gray-500/30"
                  >
                    <TableCell>
                      {test.passed === true ? (
                        <Badge
                          variant="outline"
                          className="border-green-800 bg-green-950 text-green-400"
                        >
                          <CheckCircle className="mr-1 size-3" /> Pass
                        </Badge>
                      ) : (
                        test.passed === false && (
                          <Badge
                            variant="outline"
                            className="border-red-800 bg-red-950 text-red-400"
                          >
                            <XCircle className="mr-1 size-3" /> Fail
                          </Badge>
                        )
                      )}
                    </TableCell>
                    <TableCell>{test.input.join(', ')}</TableCell>
                    <TableCell>{test.expected}</TableCell>
                    <TableCell>{test.received}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'code-execution' && executeResult && (
          <pre className="rounded-md bg-gray-950 p-4 text-gray-300">
            <code>{executeResult}</code>
          </pre>
        )}
      </ScrollArea>
    </>
  )
}
