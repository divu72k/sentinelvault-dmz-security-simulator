import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Key, Eye, EyeOff, RefreshCcw, Binary } from 'lucide-react';
import { generateKey, encryptData, arrayBufferToHex, exportKeyToHex } from '@/lib/crypto-utils';
import { toast } from 'sonner';
export default function EncryptionPage() {
  const [plaintext, setPlaintext] = useState('');
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [keyHex, setKeyHex] = useState('');
  const [ivHex, setIvHex] = useState('');
  const [ciphertextHex, setCiphertextHex] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPlaintext, setShowPlaintext] = useState(true);
  const handleGenerateKey = async () => {
    try {
      const key = await generateKey();
      const hex = await exportKeyToHex(key);
      setEncryptionKey(key);
      setKeyHex(hex);
      toast.success("New 256-bit AES-GCM Key generated in secure memory");
    } catch (err) {
      toast.error("Failed to generate encryption key");
    }
  };
  const handleEncrypt = async () => {
    if (!encryptionKey) {
      toast.error("Generate a key first");
      return;
    }
    if (!plaintext) {
      toast.error("Input plaintext to encrypt");
      return;
    }
    setIsProcessing(true);
    try {
      const { ciphertext, iv } = await encryptData(encryptionKey, plaintext);
      setIvHex(arrayBufferToHex(iv));
      setCiphertextHex(arrayBufferToHex(ciphertext));
      toast.success("Data encrypted successfully");
    } catch (err) {
      toast.error("Encryption failed");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Encryption <span className="text-primary">Sandbox</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
            AES-256-GCM Secure Channel Simulation
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" /> Key Management
                </CardTitle>
                <CardDescription>Generate or import simulated service keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Active Key (Hex)</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={keyHex} 
                      readOnly 
                      placeholder="0x000..." 
                      className="font-mono text-xs bg-black/40"
                    />
                    <Button size="icon" variant="secondary" onClick={handleGenerateKey}>
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono italic">
                    Keys are generated via Web Crypto API and never leave this sandbox.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Binary className="h-4 w-4 text-primary" /> Input Plaintext
                </CardTitle>
                <CardDescription>Enter sensitive data to be protected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Data String</Label>
                    <Button variant="ghost" size="sm" onClick={() => setShowPlaintext(!showPlaintext)}>
                      {showPlaintext ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Textarea 
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder="Enter sensitive message..."
                    className={cn(
                      "font-mono text-sm bg-black/40 min-h-[120px]",
                      !showPlaintext && "blur-sm select-none"
                    )}
                  />
                </div>
                <Button 
                  className="w-full font-bold uppercase tracking-widest" 
                  disabled={!encryptionKey || isProcessing}
                  onClick={handleEncrypt}
                >
                  <Lock className="mr-2 h-4 w-4" /> Execute AES-GCM Encryption
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="h-full border-border/50 bg-secondary/20 backdrop-blur-sm border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-500">
                  <Shield className="h-4 w-4" /> Ciphertext Output
                </CardTitle>
                <CardDescription>Encrypted payload ready for DMZ traversal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Initialization Vector (IV)</Label>
                  <Input 
                    value={ivHex} 
                    readOnly 
                    className="font-mono text-xs bg-black/40 border-emerald-500/20"
                  />
                  <p className="text-[10px] text-muted-foreground">Unique nonce generated per encryption cycle.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Ciphertext (Base16)</Label>
                  <div className="relative group">
                    <Textarea 
                      value={ciphertextHex} 
                      readOnly 
                      className="font-mono text-xs bg-black/40 border-emerald-500/20 min-h-[200px]"
                    />
                    {!ciphertextHex && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="text-xs font-mono text-muted-foreground animate-pulse">AWAITING PAYLOAD...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <h4 className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2 mb-2">
                    <Shield className="h-3 w-3" /> Integrity Check
                  </h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    AES-256-GCM provides <span className="text-foreground font-bold">Authenticated Encryption</span>. 
                    The final 16 bytes represent the Auth Tag, ensuring the payload hasn't been tampered with during transmission.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}