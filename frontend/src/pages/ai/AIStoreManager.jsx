import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Fab,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";
import { keyframes } from "@mui/system";
import {
  Bot,
  RefreshCw,
  Send,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

import { PrimaryButton, FormField } from "../../components/ui";
import aiManagerApi from "../../services/aiManagerApi";

const PRIORITY_COLOR = {
  high: "#dc2626",
  medium: "#d97706",
  low: "#2563eb",
};

const TONE_COLOR = {
  info: "#2563eb",
  success: "#059669",
  warning: "#d97706",
  error: "#dc2626",
};

const ICON_MAP = {
  warning: AlertTriangle,
  trend: TrendingUp,
  tip: Lightbulb,
  success: CheckCircle2,
  info: Sparkles,
};

const QUICK_ASKS = [
  "What should I reorder this week?",
  "What is the 7-day demand forecast?",
  "How are sales and margin looking?",
  "What should I do today?",
];

const QUICK_LINKS = [
  { label: "Forecast", href: "/forecast" },
  { label: "Inventory", href: "/inventory" },
  { label: "Reports", href: "/reports" },
];

const fabBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-6px); }
`;

const iconSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

function MetricCard({ label, value, sub, tone = "info" }) {
  const color = TONE_COLOR[tone] || TONE_COLOR.info;
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 1.75 },
        height: "100%",
        minHeight: { xs: 96, sm: 108 },
        display: "flex",
        flexDirection: "column",
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(145deg, ${color}12 0%, transparent 65%)`,
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontSize: "0.65rem",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: 800,
          mt: 0.5,
          fontSize: { xs: "1rem", sm: "1.2rem" },
          color,
          letterSpacing: "-0.02em",
          wordBreak: "break-word",
          lineHeight: 1.15,
          flexGrow: 1,
        }}
      >
        {value}
      </Typography>
      {sub ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.35, fontSize: "0.68rem" }}
          noWrap
        >
          {sub}
        </Typography>
      ) : (
        <Box sx={{ height: 14 }} />
      )}
    </Paper>
  );
}

function ActionCardItem({ action, onNavigate }) {
  const color = PRIORITY_COLOR[action?.priority] || PRIORITY_COLOR.medium;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderLeft: `3px solid ${color}`,
        height: "100%",
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        gap: 0.6,
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(15,23,42,0.06)",
        },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
        <Typography fontWeight={700} sx={{ fontSize: "0.88rem", lineHeight: 1.3 }}>
          {action?.title}
        </Typography>
        <Chip
          size="small"
          label={action?.priority || "medium"}
          sx={{
            fontWeight: 700,
            textTransform: "capitalize",
            bgcolor: `${color}18`,
            color,
            height: 20,
            fontSize: "0.62rem",
          }}
        />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontSize: "0.78rem" }}>
        {action?.message}
      </Typography>
      {(action?.metric_label || action?.link) && (
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}
        >
          {action?.metric_label ? (
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {action.metric_label}: {action.metric_value}
            </Typography>
          ) : (
            <span />
          )}
          {action?.link?.href && (
            <PrimaryButton
              variant="text"
              size="small"
              endIcon={<ArrowRight size={13} />}
              onClick={() => onNavigate(action.link.href)}
              sx={{ textTransform: "none", fontWeight: 700, px: 0.75 }}
            >
              {action.link.label || "Open"}
            </PrimaryButton>
          )}
        </Stack>
      )}
    </Paper>
  );
}

function ChatBubble({ role, content, actions, onNavigate }) {
  const isUser = role === "user";
  return (
    <Box
      sx={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: { xs: "90%", sm: "82%" },
        display: "flex",
        flexDirection: "column",
        gap: 0.6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          bgcolor: isUser ? "primary.main" : "grey.100",
          color: isUser ? "primary.contrastText" : "text.primary",
          border: isUser ? "none" : "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.45, fontSize: "0.84rem" }}>
          {content}
        </Typography>
      </Paper>
      {!isUser && (actions || []).length > 0 && (
        <Stack spacing={0.5}>
          {actions.slice(0, 2).map((a) => (
            <PrimaryButton
              key={a.id}
              variant="outlined"
              size="small"
              endIcon={<ArrowRight size={13} />}
              onClick={() => a.link?.href && onNavigate(a.link.href)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                justifyContent: "space-between",
                borderRadius: 999,
                px: 1.25,
                fontSize: "0.75rem",
              }}
            >
              {a.title}
            </PrimaryButton>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function AIStoreManager() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const chatEndRef = useRef(null);
  const chatPanelRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [brief, setBrief] = useState(null);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(true);

  const loadBrief = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await aiManagerApi.getBrief();
      setBrief(data);
    } catch (err) {
      setError(
        err?.friendlyMessage ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load AI brief"
      );
      setBrief(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: brief only — start with a clean chat (no old history)
  useEffect(() => {
    loadBrief();
  }, [loadBrief]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
    setAsking(false);
    setChatOpen(true);
  };

  const handleRefreshAll = async () => {
    startNewChat();
    await loadBrief();
  };

  const focusChat = () => {
    setChatOpen(true);
    setTimeout(() => {
      chatPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      document.getElementById("ai-chat-input")?.focus();
    }, 120);
  };

  const askQuestion = async (raw) => {
    const q = String(raw || "").trim();
    if (!q || asking) return;

    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: q, actions: [] }]);
    setAsking(true);
    setChatOpen(true);

    try {
      const res = await aiManagerApi.ask({ question: q });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res?.answer || "No answer returned.",
          actions: res?.actions || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err?.friendlyMessage ||
            err?.response?.data?.detail ||
            "Sorry — could not answer right now.",
          actions: [],
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  const handleAsk = (e) => {
    e?.preventDefault?.();
    askQuestion(question);
  };

  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default", pb: { xs: 11, md: 3 } }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 1.25, sm: 1.75 }, px: { xs: 1.5, sm: 2.25 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.25}
          sx={{
            mb: 1.75,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                boxShadow: "0 8px 18px rgba(99,102,241,0.28)",
              }}
            >
              <Bot size={20} />
            </Box>
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                AI Store Manager
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ fontSize: "0.78rem" }}>
                Brief, actions & live chat · grounded in your data
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <PrimaryButton
              variant="outlined"
              size="small"
              startIcon={
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    animation: loading ? `${iconSpin} 0.85s linear infinite` : "none",
                  }}
                >
                  <RefreshCw size={14} />
                </Box>
              }
              onClick={handleRefreshAll}
              disabled={loading}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
            >
              Refresh
            </PrimaryButton>
            <PrimaryButton
              variant="outlined"
              size="small"
              onClick={startNewChat}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
            >
              New chat
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              size="small"
              startIcon={<MessageSquare size={14} />}
              onClick={focusChat}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
            >
              Chat
            </PrimaryButton>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading && !brief ? (
          <Box sx={{ textAlign: "center", py: 7 }}>
            <CircularProgress size={30} />
            <Typography sx={{ mt: 1.25 }} color="text.secondary" variant="body2">
              Building your store brief…
            </Typography>
          </Box>
        ) : (
          <>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.75, sm: 2 },
                mb: 1.75,
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.07) 0%, rgba(37,99,235,0.03) 50%, transparent 100%)",
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.75 }}>
                <Sparkles size={15} color="#4F46E5" />
                <Typography variant="overline" fontWeight={700} color="primary" sx={{ lineHeight: 1 }}>
                  Daily brief
                </Typography>
                {brief?.model_type && (
                  <Chip size="small" label={brief.model_type} variant="outlined" sx={{ height: 20, fontSize: "0.62rem" }} />
                )}
              </Stack>
              <Typography fontWeight={800} sx={{ fontSize: { xs: "1rem", sm: "1.15rem" }, mb: 0.75, letterSpacing: "-0.02em" }}>
                {brief?.greeting || "Welcome back"}
              </Typography>
              <Stack spacing={0.6}>
                {(brief?.bullets || []).map((b, i) => {
                  const Icon = ICON_MAP[b.icon] || Sparkles;
                  return (
                    <Stack
                      key={i}
                      direction="row"
                      spacing={1}
                      onClick={() => b.href && navigate(b.href)}
                      sx={{
                        alignItems: "flex-start",
                        cursor: b.href ? "pointer" : "default",
                        "&:hover": b.href ? { opacity: 0.85 } : undefined,
                      }}
                    >
                      <Box sx={{ mt: 0.15, color: "primary.main" }}>
                        <Icon size={14} />
                      </Box>
                      <Typography variant="body2" sx={{ flex: 1, fontSize: "0.82rem" }}>
                        {b.text}
                      </Typography>
                      {b.href ? <ArrowRight size={12} /> : null}
                    </Stack>
                  );
                })}
              </Stack>
              {brief?.recommendation && (
                <Alert severity="info" sx={{ mt: 1.25, borderRadius: 2, py: 0.25 }}>
                  {brief.recommendation}
                </Alert>
              )}
            </Paper>

            {/* Equal-size KPI grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 1.25,
                mb: 1.75,
              }}
            >
              {(brief?.kpis || []).map((k) => (
                <MetricCard key={k.label} label={k.label} value={k.value} sub={k.sub} tone={k.tone || "info"} />
              ))}
            </Box>

            <Grid container spacing={1.75}>
              <Grid item xs={12} lg={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box sx={{ px: 1.75, py: 1.25, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
                    <Typography fontWeight={700} sx={{ fontSize: "0.9rem" }}>
                      Recommended actions
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      From stock, forecast & sales
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.25 }}>
                    {(brief?.actions || []).length === 0 ? (
                      <Typography color="text.secondary" sx={{ textAlign: "center", py: 2.5, fontSize: "0.85rem" }}>
                        No urgent actions — store looks stable.
                      </Typography>
                    ) : (
                      <Grid container spacing={1.1}>
                        {(brief.actions || []).map((a) => (
                          <Grid item xs={12} sm={6} key={a.id}>
                            <ActionCardItem action={a} onNavigate={navigate} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Paper
                  ref={chatPanelRef}
                  elevation={0}
                  sx={{
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: chatOpen ? "primary.light" : "divider",
                    display: "flex",
                    flexDirection: "column",
                    height: { xs: chatOpen ? 420 : "auto", lg: 480 },
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction="row"
                    onClick={() => isMobile && setChatOpen((v) => !v)}
                    sx={{
                      px: 1.75,
                      py: 1.15,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      bgcolor: "action.hover",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: isMobile ? "pointer" : "default",
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Bot size={13} />
                      </Box>
                      <Box>
                        <Typography fontWeight={700} sx={{ fontSize: "0.88rem", lineHeight: 1.2 }}>
                          Store assistant
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {messages.length ? `${messages.length} messages · session` : "New chat"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                      <PrimaryButton
                        size="small"
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          startNewChat();
                        }}
                        sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.72rem" }}
                      >
                        Clear
                      </PrimaryButton>
                      {isMobile && (
                        <IconButton size="small" aria-label="Toggle chat">
                          {chatOpen ? <ChevronDown size={16} /> : <MessageSquare size={16} />}
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  <Collapse in={chatOpen} timeout={200}>
                    <Box
                      sx={{
                        height: { xs: 250, lg: 310 },
                        overflowY: "auto",
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.1,
                      }}
                    >
                      {messages.length === 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.78rem" }}>
                            Start a new chat — try one:
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ gap: 0.75 }}>
                            {QUICK_ASKS.map((q) => (
                              <Chip
                                key={q}
                                label={q}
                                onClick={() => askQuestion(q)}
                                variant="outlined"
                                size="small"
                                disabled={asking}
                                sx={{
                                  height: "auto",
                                  py: 0.7,
                                  borderRadius: 999,
                                  fontWeight: 600,
                                  fontSize: "0.72rem",
                                  "& .MuiChip-label": {
                                    whiteSpace: "normal",
                                    textAlign: "left",
                                    px: 1.1,
                                  },
                                  "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: "rgba(99,102,241,0.06)",
                                  },
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {messages.map((m, idx) => (
                        <ChatBubble
                          key={`${m.role}-${idx}-${m.content.slice(0, 12)}`}
                          role={m.role}
                          content={m.content}
                          actions={m.actions}
                          onNavigate={navigate}
                        />
                      ))}

                      {asking && (
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", pl: 0.5 }}>
                          <CircularProgress size={13} />
                          <Typography variant="caption" color="text.secondary">
                            Thinking with your store data…
                          </Typography>
                        </Stack>
                      )}
                      <div ref={chatEndRef} />
                    </Box>

                    <Divider />

                    <Box
                      component="form"
                      id="ai-chat-form"
                      onSubmit={handleAsk}
                      sx={{ p: 1.1, display: "flex", gap: 0.75 }}
                    >
                      <FormField
                        fullWidth
                        size="small"
                        placeholder={isMobile ? "Ask about stock…" : "Ask about stock, forecast, sales…"}
                        id="ai-chat-input"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={asking}
                        inputProps={{ maxLength: 500 }}
                      />
                      <IconButton
                        type="submit"
                        color="primary"
                        disabled={asking || !question.trim()}
                        sx={{
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          borderRadius: 2,
                          width: 40,
                          height: 40,
                          "&:hover": { bgcolor: "primary.dark" },
                          "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
                        }}
                      >
                        <Send size={16} />
                      </IconButton>
                    </Box>
                  </Collapse>
                </Paper>
              </Grid>
            </Grid>

            <Stack
              direction="row"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 1.75, justifyContent: "center", gap: 1 }}
            >
              {QUICK_LINKS.map((l) => (
                <PrimaryButton
                  key={l.href}
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowRight size={13} />}
                  onClick={() => navigate(l.href)}
                  sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600, px: 1.5 }}
                >
                  {l.label}
                </PrimaryButton>
              ))}
            </Stack>
          </>
        )}
      </Container>

      {/* Bouncing FAB */}
      <Zoom in>
        <Fab
          color="primary"
          aria-label="Open AI chat"
          onClick={focusChat}
          sx={{
            position: "fixed",
            bottom: { xs: 18, md: 26 },
            right: { xs: 16, md: 26 },
            zIndex: (t) => t.zIndex.tooltip,
            width: 54,
            height: 54,
            borderRadius: "16px",
            boxShadow: "0 10px 26px rgba(99,102,241,0.35)",
            animation: `${fabBounce} 1.4s ease-in-out infinite`,
            "&:hover": {
              animation: "none",
              transform: "scale(1.06)",
            },
          }}
        >
          <Bot size={21} />
        </Fab>
      </Zoom>
    </Box>
  );
}